import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {Linea} from '../Models/Linea';
import {FermataShort} from '../Models/FermataShort';
import {MatCheckboxChange} from '@angular/material';
import {PrenotazioneService} from '../Services/prenotazione.service';
import {Router} from '@angular/router';
import {Disponibilita} from '../Models/Disponibilita';
import {AttendanceService} from '../Services/pedibus.attendance.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './disponibilita.component.html',
  styleUrls: ['./disponibilita.component.css']
})

export class DisponibiltaComponent implements OnInit {
  monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  corsa1: FormGroup;
  corsa2: FormGroup;
  corsa3: FormGroup;
  corsa4: FormGroup;
  corsa5: FormGroup;
  error: string;
  errorFirstStep: string;
  selected: string;
  today: Date;
  i: string;
  next5Days: Date[] = [];
  fermateLinea: FermataShort[] = [];
  fermataAndataDefault: FermataShort;
  disponibilitaNext5Days: Disponibilita[] = [];
  fermata: FermataShort;
  message: string;
  currentEvent: MatCheckboxChange;
  linee: Linea[] = [];
  secondStep = false;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private prenotazioneService: PrenotazioneService,
              private attendanceService: AttendanceService,
              private router: Router) {

  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      linee: ['', Validators.required]
    });

    this.corsa1 = new FormGroup({
      fermateAndata : new FormControl([Validators.required]),
      fermateRitorno : new FormControl([Validators.required]),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa2 = new FormGroup({
      fermateAndata : new FormControl([Validators.required]),
      fermateRitorno : new FormControl([Validators.required]),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa3 = new FormGroup({
      fermateAndata : new FormControl([Validators.required]),
      fermateRitorno : new FormControl([Validators.required]),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa4 = new FormGroup({
      fermateAndata : new FormControl([Validators.required]),
      fermateRitorno : new FormControl([Validators.required]),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa5 = new FormGroup({
      fermateAndata : new FormControl([Validators.required]),
      fermateRitorno : new FormControl([Validators.required]),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });

    this.attendanceService.getLines().subscribe(res => {
      this.linee = res;
    }, error1 => {
      this.errorFirstStep = 'Operazione -getLineeAccompagnatore- fallita';
    });

    this.createNext5Days();
  }

  getGroup(i: number) {
    if (i === 0) {
      return this.corsa1 as FormGroup;
    } else if (i === 1) {
      return this.corsa2 as FormGroup;
    } else if (i === 2) {
      return this.corsa3 as FormGroup;
    } else if (i === 3) {
      return this.corsa4 as FormGroup;
    } else if (i === 4) {
      return this.corsa5 as FormGroup;
    }
  }

  getFermateAndDisponibilitaLinea() {
    this.secondStep = true;
    this.prenotazioneService.getFermateOfLinea(this.firstFormGroup.controls.linee.value.nome).subscribe(res => {
      this.fermateLinea = res;
      this.error = undefined;
      res.forEach(fermata => {
          if (fermata.nome === res[0].nome) {  // Set della prima fermata della linea come DEFAULT
            this.fermataAndataDefault = fermata;
            this.setFermataAndataDefault(fermata);
          }
      });
    }, error1 => {
      this.error = 'Operazione -getFermateGroupByLineaWithScuola- fallita';
    });

    this.prenotazioneService.getDisponibilitaAccompagnatore(this.firstFormGroup.controls.linee.value.nome).subscribe(
      result => { // getDisponbilitaAccompagnatore
      this.disponibilitaNext5Days = result;
      this.setDisponibilitaAttive(result);
    }, error1 => {
      this.error = 'Operazione -getDisponibilitaAccompagnatore- fallita';
    });
  }

  setVersoAndata($event: MatCheckboxChange, i: number) {
    if ($event.checked) { // Triggera la prenotazione
      this.error = undefined;
      this.message = undefined;
      this.currentEvent = $event;
      let fermata = this.getGroup(i).controls.fermateAndata.value.id as string;
      const linea = this.firstFormGroup.controls.linee.value.nome as string;
      const data = this.next5Days[i];
      const verso = 'ANDATA';

      fermata = fermata.replace(' ', '_');

      this.prenotazioneService.prenotaDisponibilita(fermata, data, verso, linea).subscribe(
        result => {
          this.message = 'Disponibilita per la corsa   DATA: ' + this.formatDate(this.next5Days[i]) + ' LINEA: '
          + linea + '  VERSO: ' + verso + ' FERMATA: ' + this.getGroup(i).controls.fermateAndata.value.nome as string
            + ' \ninserita con successo';

          const newDisponibilita: Disponibilita = {
            id: '',  // todo: Occorre dare un ID alle disponibilita??
            data,
            verso,
            fermata: this.getGroup(i).controls.fermateAndata.value,
            confermata: false
          };
          this.disponibilitaNext5Days.push(newDisponibilita);

          this.getGroup(i).controls.checkBoxAndata.setValue(1);
          this.currentEvent.source.checked = true;
        }, error1 => {
          this.error = 'Operazione -prenotaDisponibilita- fallita';
          this.currentEvent.source.checked = false;
        });
    } else {  // Triggera il cancellamento della prenotazione
      this.error = undefined;
      this.message = undefined;
      this.currentEvent = $event;
      const d = this.next5Days[i];
      const verso = 'ANDATA';
      let disponibilitaDaCancellare: any;
      // Aggiungere se serve qua la fermata

      this.disponibilitaNext5Days.forEach( disponibilita => {
        if (disponibilita.verso === verso && this.formatDate(disponibilita.data) === this.formatDate(d)) {
          disponibilitaDaCancellare = disponibilita;
        }
      });

      this.prenotazioneService.deleteDisponibilita(disponibilitaDaCancellare.fermata.linea, disponibilitaDaCancellare.fermata.nome,
        disponibilitaDaCancellare.id).subscribe(
        res => {
          const index = this.disponibilitaNext5Days.indexOf(disponibilitaDaCancellare);
          this.disponibilitaNext5Days.splice(index);

          this.message = 'Disponibilita   DATA: ' + this.formatDate(this.next5Days[i]) + ' LINEA: ' +
            disponibilitaDaCancellare.fermata.linea + '  VERSO: ' + verso + ' FERMATA: ' +
            disponibilitaDaCancellare.fermata.nome + ' \ncancellata con successo';
          this.getGroup(i).controls.checkBoxAndata.setValue(0);
          this.currentEvent.source.checked = false;
        }, error1 => {
          this.error = 'Operazione -deleteDisponibilita- fallita';
          this.currentEvent.source.checked = true;
        }
      );
    }
  }

  setVersoRitorno($event: MatCheckboxChange, i: number) {
    if ($event.checked) {
      this.error = undefined;
      this.message = undefined;
      this.currentEvent = $event;
      let fermata = this.getGroup(i).controls.fermateRitorno.value.id as string;
      const linea = this.firstFormGroup.controls.linee.value.nome as string;
      const data = this.next5Days[i];
      const verso = 'RITORNO';

      fermata = fermata.replace(' ', '_');

      this.prenotazioneService.prenotaDisponibilita(fermata, data, verso, linea).subscribe(
        result => {
          this.message = 'Disponibilita della corsa   DATA: ' + this.formatDate(this.next5Days[i]) + ' LINEA: ' + linea +
          '  VERSO: ' + verso + ' FERMATA: ' + this.getGroup(i).controls.fermateRitorno.value.nome as string + ' \ninserita con successo';

          const newDisponibilita: Disponibilita = {
            id: '',  // todo: Occorre dare un ID alle disponibilita??
            data,
            verso,
            fermata: this.getGroup(i).controls.fermateRitorno.value,
            confermata: false
          };
          this.disponibilitaNext5Days.push(newDisponibilita);

          this.getGroup(i).controls.checkBoxRitorno.setValue(1);
          this.currentEvent.source.checked = true;
        }, error1 => {
          this.error = 'Operazione -prenotaDisponibilita- fallita';
          this.currentEvent.source.checked = false;
        });
    } else { // Triggera il cancellamento della prenotazione
      this.error = undefined;
      this.message = undefined;
      this.currentEvent = $event;
      const d = this.next5Days[i];
      const verso = 'RITORNO';
      let disponibilitaDaCancellare: any;
      // Aggiungere se serve qua la fermata

      // Cercare grazie alla data e verso la disponibilità da eliminare
      this.disponibilitaNext5Days.forEach( disponibilita => {
        if (disponibilita.verso === verso && this.formatDate(disponibilita.data) === this.formatDate(d)) {
          disponibilitaDaCancellare = disponibilita;
        }
      });

      this.prenotazioneService.deletePrenotazione(disponibilitaDaCancellare.fermata.linea, disponibilitaDaCancellare.fermata.nome,
        disponibilitaDaCancellare.id).subscribe(
        res => {
          const index = this.disponibilitaNext5Days.indexOf(disponibilitaDaCancellare);
          this.disponibilitaNext5Days.splice(index);

          this.message = 'Disponibilita   DATA: ' + this.formatDate(this.next5Days[i]) + ' LINEA: ' +
            disponibilitaDaCancellare.fermata.linea + '  VERSO: ' + verso + ' FERMATA: ' +
            disponibilitaDaCancellare.fermata.nome + ' \ninserita con successo';
          this.getGroup(i).controls.checkBoxRitorno.setValue(0);
          this.currentEvent.source.checked = false;
        }, error1 => {
          this.error = 'Operazione -deleteDisponibilita- fallita';
          this.currentEvent.source.checked = true;
        }
      );
    }
  }

  checkAndata(i: number) {
    return this.getGroup(i).controls.checkBoxAndata.value === 1;
  }
  checkRitorno(i: number) {
    return this.getGroup(i).controls.checkBoxRitorno.value === 1;
  }

  setFermataAndataDefault(fermata: FermataShort) {
    this.corsa1.controls.fermateAndata.setValue(fermata);
    this.corsa2.controls.fermateAndata.setValue(fermata);
    this.corsa3.controls.fermateAndata.setValue(fermata);
    this.corsa4.controls.fermateAndata.setValue(fermata);
    this.corsa5.controls.fermateAndata.setValue(fermata);
    this.corsa1.controls.fermateRitorno.setValue(fermata);
    this.corsa2.controls.fermateRitorno.setValue(fermata);
    this.corsa3.controls.fermateRitorno.setValue(fermata);
    this.corsa4.controls.fermateRitorno.setValue(fermata);
    this.corsa5.controls.fermateRitorno.setValue(fermata);
  }

  private setDisponibilitaAttive(disponibilitas: Disponibilita[]) {
    const today = this.today;
    let i = 0;
    disponibilitas.forEach( disponibilita => {
      const curDate = disponibilita.data;
      const a = curDate.getTime() - today.getTime();
      const diff = Math.abs(curDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diff / (86400000));

      // Get del corrispondente form {corsa1, corsa2, ...} in base alla data
      // this.prenotazioniNext5Days[i].corsaIndex = diffDays;
      const id = disponibilita.fermata.id;

      this.fermateLinea.forEach( fermata => {
          if (fermata.id === id) {
            this.fermata = fermata;
          }
      });

      if (disponibilita.verso === 'ANDATA') {
        if (diffDays === 0) {
          this.corsa1.controls.fermateAndata.setValue(this.fermata as FermataShort);
          this.corsa1.controls.checkBoxAndata.setValue(1);
        } else if (diffDays === 1) {
          this.corsa2.controls.fermateAndata.setValue(this.fermata as FermataShort);
          this.corsa2.controls.checkBoxAndata.setValue(1);
        } else if (diffDays === 2) {
          this.corsa3.controls.fermateAndata.setValue(this.fermata as FermataShort);
          this.corsa3.controls.checkBoxAndata.setValue(1);
        } else if (diffDays === 3) {
          this.corsa4.controls.fermateAndata.setValue(this.fermata as FermataShort);
          this.corsa4.controls.checkBoxAndata.setValue(1);
        } else if (diffDays === 4) {
          this.corsa5.controls.fermateAndata.setValue(this.fermata as FermataShort);
          this.corsa5.controls.checkBoxAndata.setValue(1);
        }
      } else if (disponibilita.verso === 'RITORNO') {
        if (diffDays === 0) {
          this.corsa1.controls.fermateRitorno.setValue(this.fermata as FermataShort);
          this.corsa1.controls.checkBoxRitorno.setValue(1);
        } else if (diffDays === 1) {
          this.corsa2.controls.fermateRitorno.setValue(this.fermata as FermataShort);
          this.corsa2.controls.checkBoxRitorno.setValue(1);
        } else if (diffDays === 2) {
          this.corsa3.controls.fermateRitorno.setValue(this.fermata as FermataShort);
          this.corsa3.controls.checkBoxRitorno.setValue(1);
        } else if (diffDays === 3) {
          this.corsa4.controls.fermateRitorno.setValue(this.fermata as FermataShort);
          this.corsa4.controls.checkBoxRitorno.setValue(1);
        } else if (diffDays === 4) {
          this.corsa5.controls.fermateRitorno.setValue(this.fermata as FermataShort);
          this.corsa5.controls.checkBoxRitorno.setValue(1);
        }
      }
      i += 1;
    });
  }

  private createNext5Days() {
    let count = 0;
    let multiplier = 1;

    this.today = new Date();
    if (this.dayNames[this.today.getDay()] === 'Domenica') {
      this.today = new Date(this.today.getTime() + 86400000);
    }
    this.next5Days.push(this.today);

    while (count < 4) {
      let day = new Date(this.today.getTime() + (86400000 * multiplier));
      const a = day.getDay();
      const giorno = this.dayNames[a];
      if (giorno === 'Domenica') {
        multiplier += 1;
        day = new Date(this.today.getTime() + (86400000 * multiplier));
      }
      this.next5Days.push(day);

      count += 1;
      multiplier += 1;
    }
  }

  goToHomePage() {
    this.router.navigate(['/']);
  }

  formatDate(data: Date) {
    const day = data.getDate();
    const monthIndex = data.getMonth();
    const dayIndex = data.getDay();

    return '' + this.dayNames[dayIndex] + '-' + day + '-' + this.monthNames[monthIndex];
  }

  private formatDateToServer(today: Date) {
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return dd + mm + yyyy;
  }

  eraseFields() {
    this.fermateLinea = undefined;
    this.fermataAndataDefault = undefined;
  }

  generateIdAndata(i: number) {
    return 'checkBoxAndata' + i.toString();
  }

  generateIdRitorno(i: number) {
    return 'checkBoxRitorno' + i.toString();
  }
}
