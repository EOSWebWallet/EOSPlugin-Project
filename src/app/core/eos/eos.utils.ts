import * as Eos from 'eosjs';
import * as ricardianParser from 'eos-rc-parser';

import { PromptType, ISignaturePromtOptions } from '../prompt/prompt.interface';
import { NetworkError, NetworkMessageType } from '../message/message.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';
import { ISigner, ISignatureOptions, ISignatureResult } from './eos.interface';
import { IPlugin } from '../plugin/plugin.interface';
import { IAccountIdentity } from '../account/account.interface';

import { NetworkUtils } from '../network/network.utils';
import { AccountUtils } from '../account/account.utils';
import { BrowserAPIUtils } from '../browser/browser.utils';
import { PromptUtils } from '../prompt/prompt.utils';

const { ecc } = Eos.modules;
const proxy = (dummy, handler) => new Proxy(dummy, handler);

export class EOSUtils {

  static createEOS(signer: ISigner): Function {
    return (network, _eos, _options: any = {}, protocol = 'http') => {
      if (!network.hasOwnProperty('protocol') || !network.protocol.length) {
        network.protocol = protocol;
      }

      network = NetworkUtils.fromJson(network);
      if (!NetworkUtils.isValid(network)) {
        throw NetworkError.noNetwork();
      }
      const httpEndpoint = `${network.protocol}://${network.host}:${network.port}`;

      const chainId = network.hasOwnProperty('chainId') && network.chainId.length ? network.chainId : _options.chainId;
      network.chainId = chainId;

      return proxy(_eos({ httpEndpoint }), {
        get(eosInstance, method) {
          return (...args) => {
            if (args.find(arg => arg.hasOwnProperty('keyProvider'))) {
              throw NetworkError.usedKeyProvider();
            }

            const signProvider = EOSUtils.createSignatureProvider(
              network,
              signer,
              args.find(arg => arg.hasOwnProperty('signProvider'))
            );

            return new Promise((resolve, reject) => {
              _eos(Object.assign(_options, { httpEndpoint, signProvider, chainId }))[method](...args)
                .then(result => {
                  // Standard method ( ie. not contract )
                  if (!result.hasOwnProperty('fc')) {
                    resolve(result);
                    return;
                  }

                  // Catching chained promise methods ( contract .then action )
                  const contractProxy = proxy(result, {
                    get(instance, _method) {
                      if (_method === 'then') {
                        return instance[_method];
                      }
                      return (..._args) => {
                        return new Promise(async (res, rej) => {
                          instance[_method](..._args).then(actionResult => {
                            res(actionResult);
                          }).catch(rej);
                        });
                      };
                    }
                  });

                  resolve(contractProxy);
                }).catch(error => reject(error));
            });
          };
        }
      });
    };
  }

  static requestSignature(options: ISignatureOptions): Promise<ISignatureResult | NetworkError> {
    return new Promise(resolve => {
      const { identity, plugin, privateKey, payload } = options;
      const account = AccountUtils.getAccount(identity, plugin.keychain.accounts);
      if (!account) {
        resolve(NetworkError.signatureAccountMissing());
      }

      const requiredAccounts = EOSUtils.actionParticipants(payload);
      const formattedName = EOSUtils.accountFormatter(AccountUtils.getNetworkAccount(identity.accounts[0], account));
      if (!requiredAccounts.includes(formattedName) && !requiredAccounts.includes(account.keypair.publicKey)) {
        resolve(NetworkError.signatureAccountMissing());
      }

      PromptUtils.open({
        type: PromptType.REQUEST_SIGNATURE,
        payload,
        responder: approval => {
          if (!approval || !approval.hasOwnProperty('accepted')) {
              resolve(NetworkError.signatureError('signature_rejected', 'User rejected the signature request'));
              return false;
          }

          EOSUtils.signer(privateKey, payload, signature => {
            if (!signature) {
              resolve(NetworkError.maliciousEvent());
              return false;
            }
            resolve({
              signatures: [ signature ]
            });
          });
        }
      } as ISignaturePromtOptions);
    });
  }

  private static createSignatureProvider(network, signer, multiSigKeyProvider): Function {
    return async signargs => {
      signargs.messages = await EOSUtils.requestParser(signargs, network);

      const result = await signer.requestSignature({
        ...signargs,
        domain: BrowserAPIUtils.host,
        network
      });

      if (!result) {
        return null;
      }

      if (result.hasOwnProperty('signatures')) {
        if (multiSigKeyProvider) {
          result.signatures.push(multiSigKeyProvider.signProvider(signargs.buf, signargs.sign));
        }
        return result.signatures;
      }

      return result;
    };
  }

  private static async requestParser(signargs, network) {
    const eos = Eos({ httpEndpoint: NetworkUtils.fullhost(network), chainId: network.chainId });

    const contracts = signargs.transaction.actions.map(action => action.account)
      .reduce((acc, contract) => {
          if (!acc.includes(contract)) {
            acc.push(contract);
          }
          return acc;
      }, []);

    const staleAbi = +new Date() - (1000 * 60 * 60 * 24 * 2);
    const abis = {};

    await Promise.all(contracts.map(async contractAccount => {
      abis[contractAccount] = (await eos.contract(contractAccount)).fc;
    }));

    return await Promise.all(signargs.transaction.actions.map(async (action, index) => {
      const contractAccountName = action.account;

      const abi = abis[contractAccountName];

      const data = abi.fromBuffer(action.name, action.data);
      const actionAbi = abi.abi.actions.find(fcAction => fcAction.name === action.name);
      let ricardian = actionAbi ? actionAbi.ricardian_contract : null;

      if (ricardian) {
        const htmlFormatting = { h1: 'div class="ricardian-action"', h2: 'div class="ricardian-description"' };
        const signer = action.authorization.length === 1 ? action.authorization[0].actor : null;
        ricardian = ricardianParser.parse(action.name, data, ricardian, signer, htmlFormatting);
      }

      return {
        data,
        code: action.account,
        type: action.name,
        authorization: action.authorization,
        ricardian
      };
    }));
  }

  private static actionParticipants(payload): string[] {
    const flatten = (array) => {
      return array.reduce(
          (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
      );
    };
    return flatten(
      payload.messages
        .map(message => message.authorization
          .map(auth => `${auth.actor}@${auth.permission}`))
    );
  }

  private static accountFormatter(account: any): string {
    return `${account.name}@${account.authority}`;
  }

  private static signer(privateKey: string, payload: any, cb: Function, arbitrary = false, isHash = false): void {
    if (!privateKey) {
      cb(null);
    }

    const sig = arbitrary && isHash
      ? ecc.Signature.signHash(payload.data, privateKey).toString()
      : ecc.sign(Buffer.from(arbitrary ? payload.data : payload.buf.data, 'utf8'), privateKey);

    cb(sig);
  }
}
