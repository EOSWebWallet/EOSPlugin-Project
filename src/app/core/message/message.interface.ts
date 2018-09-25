export interface IExtensionMessage {
  type: string;
  payload?: string;
}

export interface INetworkMessage {
  type: string;
  payload: any;
  resolver: string;
  domain?: string;
}

export enum ExtensionMessageType {
  SET_SEED = 'SET_SEED',
  STORE_PLUGIN = 'STORE_PLUGIN',
  IS_AUTHORIZED = 'IS_AUTHORIZED',
  LOAD_PLUGIN = 'LOAD_PLUGIN',
  GET_ACCOUNT = 'GET_ACCOUNT',
}

export enum NetworkMessageType {
  ABI_CACHE = 'ABI_CACHE',
  ERROR = 'ERROR',
  PUSH_PLUGIN = 'PUSH_PLUGIN',
  GET_ACCOUNT = 'GET_ACCOUNT',
  REQUEST_SIGNATURE = 'REQUEST_SIGNATURE',
}

export enum NetworkErrorCode {
  NO_SIGNATURE = 402,
  FORBIDDEN = 403,
  TIMED_OUT = 408,
  LOCKED = 423,
  UPGRADE_REQUIRED = 426,
  TOO_MANY_REQUESTS = 429
}

export class NetworkError {
  type: string;
  message: string;
  code: number;
  isError: boolean;

  constructor(type: string, message?: string, code?: number) {
    this.type = type;
    this.message = message;
    this.code = code || NetworkErrorCode.LOCKED;
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
      'Do not use a `keyProvider` with a Scatter. Use a `signProvider` and return only signatures to this object.'
        + ' A malicious person could retrieve your keys otherwise.',
      NetworkErrorCode.NO_SIGNATURE
    );
  }

  static malformedRequiredFields(): NetworkError {
    return new NetworkError('malformed_requirements', 'The requiredFields you passed in were malformed', NetworkErrorCode.NO_SIGNATURE);
  }
}
