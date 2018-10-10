import { ISelectOption } from '../../../../shared/form/select/select.interface';

export interface IAccountForm {
  id?: string;
  name: string;
  keypair: {
    publicKey: string;
    privateKey: string;
  };
  network: ISelectOption;
  accounts: ISelectOption[];
}
