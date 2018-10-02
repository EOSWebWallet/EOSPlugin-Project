import { IPlugin } from '../plugin/plugin.interface';
import { KeychainUtils } from '../keychain/keychain.utils';
import { NetworkError } from '../message/message.interface';
import { AccountUtils } from '../account/account.utils';
import { NetworkUtils } from '../network/network.utils';
import { IAccount, IAccountIdentity } from '../account/account.interface';
import { EOSUtils } from '../eos/eos.utils';
import { EOSPlugin } from '../../../plugin';
import { PromptType, ISignaturePromtOptions } from '../prompt/prompt.interface';
import { PromptUtils } from '../prompt/prompt.utils';

export class SignatureService {

  static requestSignature(plugin: IPlugin, identity: IAccountIdentity, payload: any, privateKey: string, sendResponse: Function): void {
    const { network } = payload;

    const account = AccountUtils.getAccount(identity, plugin.keychain.accounts);
    if (!account) {
      sendResponse(NetworkError.signatureAccountMissing());
    }

    const requiredAccounts = EOSUtils.actionParticipants(payload);
    const formattedName = EOSUtils.accountFormatter(AccountUtils.getNetworkAccount(identity.accounts[0], account));
    if (!requiredAccounts.includes(formattedName) && !requiredAccounts.includes(account.keypair.publicKey)) {
      sendResponse(NetworkError.signatureAccountMissing());
    }

    const sign = returnedFields => {
      EOSUtils.signer(privateKey, payload, signature => {
        if (!signature) {
          sendResponse(NetworkError.maliciousEvent());
          return false;
        }
        sendResponse({
          signatures: [ signature ],
          returnedFields
        });
      });
    };

    PromptUtils.open({
      type: PromptType.REQUEST_SIGNATURE,
      payload,
      responder: approval => {
        if (!approval || !approval.hasOwnProperty('accepted')) {
            sendResponse(NetworkError.signatureError('signature_rejected', 'User rejected the signature request'));
            return false;
        }
        sign(approval.returnedFields);
      }
    } as ISignaturePromtOptions);
  }
}
