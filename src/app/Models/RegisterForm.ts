import {BambinoRegistration} from './BambinoRegistration';

export interface RegisterForm {
  name: string;
  surname: string;
  email: string;
  pass: string;
  pass2: string;
  fermataDefault: string;
  figli: BambinoRegistration[];
}
