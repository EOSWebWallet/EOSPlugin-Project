import * as Eos from 'eosjs';
const { ecc } = Eos.modules;
import { NetworkMessageType, INetworkMessage, NetworkError } from './app/core/message/message.interface';
import { EncryptUtils } from './app/core/encrypt/encrypt.utils';
import { EncryptedStream } from 'extension-streams/dist';
import { IAccount } from './app/core/account/account.interface';
import { EOSUtils } from './app/core/eos/eos.utils';


interface IResolver {
  id: string;
  resolve: (payload: any) => void;
  reject: (payload: any) => void;
}

export class EOSPlugin {
  static STREAM_NAME = 'eosPlugin';

  private stream: EncryptedStream | any;
  private resolvers: IResolver[] = [];
  private account: IAccount;

  private signatureProvider = new EOSUtils().signatureProvider(this.send, this.throwIfNoIdentity);

  constructor(stream: EncryptedStream) {
    this.stream = stream;
    this.subscribe();
  }

  getAccount(fields = {}): Promise<IAccount> {
    return this.send(NetworkMessageType.GET_ACCOUNT, { fields })
      .then(account => {
        this.account = account;
        return account;
      });
  }

  private send(type: NetworkMessageType, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const resolver = EncryptUtils.numeric(24);
      const message: INetworkMessage = { type, payload, resolver };
      this.resolvers.push({ id: resolver, resolve, reject });
      this.stream.send(message, EOSPlugin.STREAM_NAME);
    });
  }

  private subscribe(): void {
    this.stream.listenWith(msg => {
      if (!msg || !msg.hasOwnProperty('type')) {
        return false;
      }
      for (let i = 0; i < this.resolvers.length; i++) {
        if (this.resolvers[i].id === msg.resolver) {
          if (msg.type === NetworkMessageType.ERROR) {
            this.resolvers[i].reject(msg.payload);
          } else {
            this.resolvers[i].resolve(msg.payload);
          }
          this.resolvers = this.resolvers.slice(i, 1);
        }
      }
    });
  }

  private throwIfNoIdentity() {
    if (!this.account || !this.account.keypair.publicKey) {
      this.throws('There is no identity with an account set on your Scatter instance.');
    }
  }

  private throws(msg) {
    throw new NetworkError(msg);
  }
}
