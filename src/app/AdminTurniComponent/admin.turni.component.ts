import {Component, Injectable, OnInit} from '@angular/core';
import {Linea, AttendanceService} from '../Services/pedibus.attendance.service';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DisponibilitaCorsa} from '../Models/DisponibilitaCorsa';
import {MatCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-pedibus-turni',
  templateUrl: './admin.turni.component.html',
  styleUrls: ['./admin.turni.component.css']
})


export class AdminTurniComponent implements OnInit {
  data: DisponibilitaCorsa;
  linee: Linea[];
  selectedData: string;
  error: string;
  errorLeft: string;
  errorRight: string;
  dateLineForm: FormGroup;
  accompagnatoriAndata: Array<string> = [];
  accompagnatoriRitorno: Array<string> = [];
  message: string;
  classType = 'centeredCard';

  constructor(private attendanceService: AttendanceService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private formBuilder: FormBuilder) {

    if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.attendanceService.getLines().subscribe(
      x => {
        this.linee = x;
        this.errorLeft = undefined;
      },
      error1 => {
        this.errorLeft = 'Operazione -getLines OnInit- Fallita';
      }
    );

    this.dateLineForm = this.formBuilder.group({
      date: ['', [Validators.required]],
      line: ['', [Validators.required]]
    });
  }

  get f() { return this.dateLineForm.controls; }

  getDisponibilitaCorsa() {
    // this.selectedDate = data;
    if (this.dateLineForm.invalid) {
      this.errorLeft = 'I valori inseriti sono errati';
      return;
    }
    this.data = undefined;
    this.message = undefined;

    const linea = this.f.line.value;
    const dataSelezionata = this.formatDate(this.f.date.value);

    this.attendanceService.getAccompagnatori(linea as string, dataSelezionata).subscribe(x => {
      this.data = x;
      this.errorLeft = undefined;
      this.classType = 'leftCard';
      this.selectedData = this.formatDateDashed(this.f.date.value);
    }, error1 => {
      this.errorLeft = 'Operazione Fallita.\n Hai i privilegi necessari per gestire la linea specificata?';
      this.classType = 'centeredCard';
    });
  }

  segnaAccompagnatoreAndata($event: MatCheckboxChange, accompagnatore: string) {
    if ($event.checked) {
      this.accompagnatoriAndata.push(accompagnatore);
    } else {
      const index = this.accompagnatoriAndata.indexOf(accompagnatore);
      this.accompagnatoriAndata.splice(index);
    }
  }

  segnaAccompagnatoreRitorno($event: MatCheckboxChange, accompagnatore: string) {
    if ($event.checked) {
      this.accompagnatoriRitorno.push(accompagnatore);
    } else {
      const index = this.accompagnatoriRitorno.indexOf(accompagnatore);
      this.accompagnatoriRitorno.splice(index);
    }
  }

  consolidaTurnoAndata() {
    console.log(this.accompagnatoriAndata);

    this.attendanceService.consolidaTurno(this.data.linea, this.formatDate(this.data.date), 'ANDATA', this.accompagnatoriAndata)
      .subscribe(x => {
      this.errorRight = undefined;
      this.data.chiusoAndata = true;
      this.message = 'Turno consolidato con successo';
    }, error1 => {
      this.errorRight = 'Operazione -consolidaTurno- Fallita';
      this.data.chiusoAndata = false;
    });
  }

  consolidaTurnoRitorno() {
    console.log(this.accompagnatoriRitorno);

    this.attendanceService.consolidaTurno(this.data.linea, this.formatDate(this.data.date), 'RITORNO', this.accompagnatoriRitorno)
      .subscribe(x => {
      this.errorRight = undefined;
      this.data.chiusoRitorno = true;
      this.message = 'Turno consolidato con successo';
    }, error1 => {
      this.errorRight = 'Operazione -consolidaTurno- Fallita';
      this.data.chiusoRitorno = false;
    });
  }

  /*
  selezionaLinea($event: MatRadioChange) {
    console.log('Linea selezionata: ' + $event.value + ' data selezionata: ' + this.formatDate(this.data.date));
    this.attendanceService.getDisponibilitaCorsa($event.value, this.formatDate(this.data.date)).subscribe(x => {
      this.data = x;
      this.error = undefined;
    }, error1 => {
      this.error = 'Operazione -selezionaLinea- Fallita.\n Hai i privilegi necessari per gestire la linea specificata?';
    });
  }
   */

  /*
  segnaPresente($event: MouseEvent, bambino: Bambino, verso: string, feramata: Fermata) {
    bambino.presente = (bambino.presente === true) ? false : true;

    this.attendanceService.cambiaStato(bambino, this.data.linea, this.data.date, verso.toUpperCase(),
      feramata).subscribe((response) => {
        // do something with the response
        console.log('Response is: ', response);
        // todo: avvisare il rispettivo genitore
      },
      (error) => {
        // catch the error
        this.error = 'Operazione -segnaPresente- fallita';
      }

    );
  }
   */

  private formatDate(data: Date) {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = data.getFullYear();
    return dd + mm + yyyy;
  }

  private formatDateDashed(data: Date) {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = data.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }
  /*getAll() {
    this.data$ = this.service.getAll();
  }

  addItem(item) {
    console.log(item.value);
    this.item$ = this.service.addItem({name: item.value})
    // .subscribe( () => this.getAll() ) // remove async pipe from code
    ;
  }*/

  /*
  esportaFile() {
    const format = this.exportControl.value;

    if (format === 'csv') {
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(this.data, null, '  ')], {type: 'text/json' });
      saveAs(blob, 'myFile.json');
    } else {
      this.error = 'Errore nel formato di download del file ' + format;
    }
  }
   */

  riapriTurnoRitorno() {

    this.attendanceService.riapriTurno(this.data.idRitorno)
      .subscribe(x => {
        this.errorRight = undefined;
        this.data.chiusoRitorno = false;
        this.message = 'Turno riaperto con successo';
      }, error1 => {
        this.errorRight = 'Operazione -riapriTurno- Fallita';
        this.data.chiusoRitorno = true;
      });
  }

  riapriTurnoAndata() {
    this.attendanceService.riapriTurno(this.data.idAndata)
      .subscribe(x => {
        this.errorRight = undefined;
        this.data.chiusoAndata = false;
        this.message = 'Turno riaperto con successo';
      }, error1 => {
        this.errorRight = 'Operazione -riapriTurno- Fallita';
        this.data.chiusoAndata = true;
      });
  }
}


