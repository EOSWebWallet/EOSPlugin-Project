import * as Eos from 'eosjs';
import * as ricardianParser from 'eos-rc-parser';

import { NetworkUtils } from '../network/network.utils';
import { NetworkError, NetworkMessageType } from '../message/message.interface';
import { INetwork, INetworkAccount } from '../network/network.interface';
import { AccountUtils } from '../account/account.utils';
import { BrowserAPIUtils } from '../browser/browser.utils';
import { AccountRequiredFields } from '../account/field.utils';

const { ecc } = Eos.modules;
const proxy = (dummy, handler) => new Proxy(dummy, handler);

export class EOSUtils {

  private static DEFAULT_PROTOCOL = 'http';

  private messageSender: Function;
  private throwIfNoIdentity: Function;

  static signatureProvider(messageSender: Function, throwIfNoIdentity: Function): Function {
    this.messageSender = messageSender;
    this.throwIfNoIdentity = throwIfNoIdentity;
    const requestParser = this.requestParser;
    return (network, _eos, _options: any = {}, protocol = EOSUtils.DEFAULT_PROTOCOL) => {
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
          let returnedFields = null;
          return (...args) => {
            if (args.find(arg => arg.hasOwnProperty('keyProvider'))) {
              throw NetworkError.usedKeyProvider();
            }

            let requiredFields = args.find(arg => arg.hasOwnProperty('requiredFields'));
            requiredFields = AccountUtils.fromJson(requiredFields ? requiredFields.requiredFields : {});

            if (!AccountRequiredFields.isValid(requiredFields)) {
              throw NetworkError.malformedRequiredFields();
            }

            const signProvider = async signargs => {
              throwIfNoIdentity();

              // Friendly formatting
              signargs.messages = await requestParser(signargs, network);

              const payload = Object.assign(signargs, { domain: BrowserAPIUtils.host, network, requiredFields });
              const result = await messageSender(NetworkMessageType.REQUEST_SIGNATURE, payload);

              // No signature
              if (!result) {
                return null;
              }

              if (result.hasOwnProperty('signatures')) {
                // Holding onto the returned fields for the final result
                returnedFields = result.returnedFields;

                // Grabbing buf signatures from local multi sig sign provider
                const multiSigKeyProvider = args.find(arg => arg.hasOwnProperty('signProvider'));
                if (multiSigKeyProvider) {
                  result.signatures.push(multiSigKeyProvider.signProvider(signargs.buf, signargs.sign));
                }

                // Returning only the signatures to eosjs
                return result.signatures;
              }

              return result;
            };

            return new Promise((resolve, reject) => {
              _eos(Object.assign(_options, { httpEndpoint, signProvider, chainId }))[method](...args)
                .then(result => {
                  // Standard method ( ie. not contract )
                  if (!result.hasOwnProperty('fc')) {
                    result = Object.assign(result, {returnedFields});
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
                                res(Object.assign(actionResult, {returnedFields}));
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
      }); // Proxy
    };
  }

  static async requestParser(signargs, network) {
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

  static actionParticipants(payload): string[] {
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

  static accountFormatter(account: any): string {
    return `${account.name}@${account.authority}`;
  }

  static signer(privateKey: string, payload: any, cb: Function, arbitrary = false, isHash = false): void {
    if (!privateKey) {
      cb(null);
    }

    const sig = arbitrary && isHash
      ? ecc.Signature.signHash(payload.data, privateKey).toString()
      : ecc.sign(Buffer.from(arbitrary ? payload.data : payload.buf.data, 'utf8'), privateKey);

    cb(sig);
  }
}
