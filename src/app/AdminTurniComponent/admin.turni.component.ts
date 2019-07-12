import {Component, Injectable, OnInit} from '@angular/core';
import {AttendanceService} from '../Services/pedibus.attendance.service';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DisponibilitaCorsa} from '../Models/DisponibilitaCorsa';
import {MatCheckboxChange} from '@angular/material';
import {Linea} from '../Models/Linea';

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


