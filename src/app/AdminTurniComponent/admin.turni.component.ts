import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {AttendanceService} from '../Services/pedibus.attendance.service';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DisponibilitaCorsa} from '../Models/DisponibilitaCorsa';
import {MatRadioChange} from '@angular/material';
import {Linea} from '../Models/Linea';
import {AccompagnatoreFermata} from '../Models/AccompagnatoreFermata';
import {Message} from '../Models/Message';
import {WebSocketService} from '../Services/websocket.service';
import {UserService} from '../Services/pedibus.user.service';

@Component({
  selector: 'app-pedibus-turni',
  templateUrl: './admin.turni.component.html',
  styleUrls: ['./admin.turni.component.css']
})


export class AdminTurniComponent implements OnInit, OnDestroy {
  monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  data: DisponibilitaCorsa;
  linee: Linea[];
  selectedData: string;
  error: string;
  errorLeft: string;
  errorRight: string;
  dateLineForm: FormGroup;
  accompagnatoreAndata: AccompagnatoreFermata;
  accompagnatoreRitorno: AccompagnatoreFermata;
  message: string;
  classType = 'centeredCard';
  selectedAndata = false;
  selectedRitorno = false;
  private stompClient: any;

  constructor(private attendanceService: AttendanceService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private formBuilder: FormBuilder,
              private websocketService: WebSocketService,
              private userService: UserService) {

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

    this.userService.getNumberNewMessages();
    this.websocketService.disconnect();
    this.websocketService.connect();
    this.websocketService.stompClient.connect({}, () => { // Callback dopo aver effettuato correttamnete la connessione
      const username = JSON.parse(localStorage.getItem('currentUser')).username;
      // console.log(username);

      this.websocketService.stompClient.subscribe('/user/' + username + '/queue/notifications', message => { // Callback nuovo messaggio
        const messageString = JSON.stringify(message);
        // console.log('Nuovo messaggio ricevuto ' + messageString);
        this.userService.updateUnreadMessages(message.body);
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
        // this.userService.updateUnreadMessages(message.body);
      });
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

  segnaAccompagnatoreAndata($event: MatRadioChange, accompagnatore: AccompagnatoreFermata) {
    if ($event.source.checked) {
      this.accompagnatoreAndata = accompagnatore;
      this.selectedAndata = true;
    } else {
      this.accompagnatoreAndata = undefined;
    }
  }

  segnaAccompagnatoreRitorno($event: MatRadioChange, accompagnatore: AccompagnatoreFermata) {
    if ($event.source.checked) {
      this.accompagnatoreRitorno = accompagnatore;
      this.selectedRitorno = true;
    } else {
      this.accompagnatoreAndata = undefined;
    }
  }

  consolidaTurnoAndata() {
    console.log(this.accompagnatoreAndata);

    this.attendanceService.consolidaTurno(this.data.linea, this.formatDate(this.data.date), 'ANDATA', this.accompagnatoreAndata)
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
    console.log(this.accompagnatoreRitorno);

    this.attendanceService.consolidaTurno(this.data.linea, this.formatDate(this.data.date), 'RITORNO', this.accompagnatoreRitorno)
      .subscribe(x => {
      this.errorRight = undefined;
      this.data.chiusoRitorno = true;
      this.message = 'Turno consolidato con successo';
    }, error1 => {
      this.errorRight = 'Operazione -consolidaTurno- Fallita';
      this.data.chiusoRitorno = false;
    });
  }

  formatDate(data: Date) {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = data.getFullYear();
    return dd + mm + yyyy;
  }

  formatDateDashed(data: Date) {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = data.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  formatDateNames(data: Date) {
    const day = data.getDate();
    const monthIndex = data.getMonth();
    const dayIndex = data.getDay();

    return '' + this.dayNames[dayIndex] + '-' + day + '-' + this.monthNames[monthIndex];
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

  ngOnDestroy(): void {
    this.websocketService.stompClient.unsubscribe();
  }
}


