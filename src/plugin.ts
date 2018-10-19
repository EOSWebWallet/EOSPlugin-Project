import * as Eos from 'eosjs';
const { ecc } = Eos.modules;
import { NetworkMessageType, INetworkMessage, NetworkError } from './app/core/message/message.interface';
import { Encryption } from './app/core/encryption/encryption';
import { EncryptedStream } from 'extension-streams/dist';
import { IAccountIdentity } from './app/core/account/account.interface';
import { EOS } from './app/core/eos/eos';
import { INetwork } from './app/core/network/network.interface';

declare var window: any;

interface IResolver {
  id: string;
  resolve: (payload: any) => void;
  reject: (payload: any) => void;
}

interface IPluginConfig {
  [network: string]: IAccountIdentity;
}

export class EOSPlugin {
  static STREAM_NAME = 'eosPlugin';

  private stream: EncryptedStream | any;
  private resolvers: IResolver[] = [];

  readonly eos = EOS.create({
    requestSignature: async signargs => {
      const identity = await this.getIdentity(signargs.network);
      if (!identity || !identity.publicKey) {
        throw new NetworkError('identity_missing', 'There is no identity with an account set on your EOSPlugin instance.');
      }
      return this.send(NetworkMessageType.REQUEST_SIGNATURE, {
        ...signargs,
        identity
      });
    }
  });

  constructor(stream: EncryptedStream) {
    this.stream = stream;
    this.subscribe();
  }

  requestIdentity(network: INetwork): Promise<IAccountIdentity> {
    return this.send(NetworkMessageType.GET_IDENTITY, { network })
      .then(identity => {
        this.saveIdentity(identity, network);
        return identity;
      });
  }

  getIdentity(network: INetwork): Promise<IAccountIdentity> {
    const identity = this.checkIdentity(network);
    return identity
      ? Promise.resolve(identity)
      : this.send(NetworkMessageType.GET_IDENTITY, { network })
        .then(requestedIdentity => {
          this.saveIdentity(requestedIdentity, network);
          return requestedIdentity;
        });
  }

  private checkIdentity(network: INetwork): IAccountIdentity {
    return this.config[`${network.protocol}://${network.host}:${network.port}`];
  }

  private saveIdentity(identity: IAccountIdentity, network: INetwork): void {
    this.config = {
      ...this.config,
      [`${network.protocol}://${network.host}:${network.port}`]: identity
    };
  }

  private get config(): IPluginConfig {
    return JSON.parse(window.localStorage.getItem('eosPlugin') || '{}');
  }

  private set config(config: IPluginConfig) {
    window.localStorage.setItem('eosPlugin', JSON.stringify(config));
  }

  private send(type: NetworkMessageType, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const resolver = Encryption.numeric(24);
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
}
