import {Bambino} from '../Services/pedibus.attendance.service';

export interface Fermata {
  id: string;
  nome: string;
  orario: string;
  bambini: Bambino[];
}
