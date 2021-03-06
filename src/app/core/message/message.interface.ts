export interface IExtensionMessage {
  type: string;
  payload?: any;
}

export interface INetworkMessage {
  type: string;
  payload: any;
  resolver: string;
  domain?: string;
}

export enum ExtensionMessageType {
  SET_SEED = 'SET_SEED',
  CHANGE_SEED = 'CHANGE_SEED',
  STORE_PLUGIN = 'STORE_PLUGIN',
  IS_AUTHORIZED = 'IS_AUTHORIZED',
  LOAD_PLUGIN = 'LOAD_PLUGIN',
  DESTROY_PLUGIN = 'DESTROY_PLUGIN',
  EXPORT_PLUGIN = 'EXPORT_PLUGIN',
  IMPORT_PLUGIN = 'IMPORT_PLUGIN',
  GET_IDENTITY = 'GET_IDENTITY',
  SET_PROMPT = 'SET_PROMPT',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
  SIGNUP = 'SIGNUP',
}

export enum NetworkMessageType {
  ABI_CACHE = 'ABI_CACHE',
  ERROR = 'ERROR',
  PUSH_PLUGIN = 'PUSH_PLUGIN',
  GET_IDENTITY = 'GET_IDENTITY',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}

export enum NetworkErrorCode {
  NO_SIGNATURE = 402,
  FORBIDDEN = 403,
  TIMED_OUT = 408,
}

export class NetworkError {
  type: string;
  message: string;
  code: number;
  isError: boolean;

  constructor(type: string, message?: string, code?: number) {
    this.type = type;
    this.message = message;
    this.code = code;
    this.isError = true;
  }

  static maliciousEvent(): NetworkError {
    return new NetworkError('malicious', 'Malicious event discarded.', NetworkErrorCode.FORBIDDEN);
  }

  static noNetwork(): NetworkError {
    return new NetworkError('no_network', 'You must bind a network first', NetworkErrorCode.NO_SIGNATURE);
  }

  static usedKeyProvider(): NetworkError {
    return new NetworkError(
      'malicious',
      'Do not use a `keyProvider` with a EOS Plugin. Use a `signProvider` and return only signatures to this object.'
        + ' A malicious person could retrieve your keys otherwise.',
      NetworkErrorCode.NO_SIGNATURE
    );
  }

  static promptClosedWithoutAction(): NetworkError {
    return new NetworkError('prompt_closed', 'The user closed the prompt without any action.', NetworkErrorCode.TIMED_OUT);
  }

  static signatureError(_type, _message): NetworkError {
    return new NetworkError(_type, _message, NetworkErrorCode.NO_SIGNATURE);
  }

  static signatureAccountMissing(): NetworkError {
    return this.signatureError('account_missing', 'Missing required accounts, repull the identity');
  }
}
