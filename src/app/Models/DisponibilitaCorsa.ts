import {Accompagnatore} from './Accompagnatore';
import {AccompagnatoriVerso} from './AccompagnatoriVerso';
import {AccompagnatoreFermata} from './AccompagnatoreFermata';

export interface DisponibilitaCorsa {
  idAndata: string;
  idRitorno: string;
  date: Date;
  linea: string;
  accompagnatoriAndata: AccompagnatoreFermata[];
  accompagnatoriRitorno: AccompagnatoreFermata[];
  chiusoAndata: boolean;
  chiusoRitorno: boolean;
}
