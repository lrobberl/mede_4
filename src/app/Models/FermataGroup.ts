import {FermataShort} from './FermataShort';

export interface FermataGroup {
  disabled?: boolean;
  nome: string;
  fermate: FermataShort[];
}
