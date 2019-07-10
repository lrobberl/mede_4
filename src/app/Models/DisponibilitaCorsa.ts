import {Accompagnatore} from './Accompagnatore';
import {AccompagnatoriVerso} from './AccompagnatoriVerso';

export interface DisponibilitaCorsa {
  idAndata: string;
  idRitorno: string;
  date: Date;
  linea: string;
  accompagnatoriAndata: Array<string>;
  accompagnatoriRitorno: Array<string>;
  chiusoAndata: boolean;
  chiusoRitorno: boolean;
}
