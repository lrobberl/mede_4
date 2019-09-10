import {Component, OnDestroy, OnInit} from '@angular/core';
import {AttendanceService} from '../Services/pedibus.attendance.service';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import {Bambino} from '../Models/Bambino';
import {Fermata} from '../Models/Fermata';
import {CorsaWrapper} from '../Models/CorsaWrapper';
import {Linea} from '../Models/Linea';
import {WebSocketService} from '../Services/websocket.service';
import {UserService} from '../Services/pedibus.user.service';

@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.attendance.component.html',
  styleUrls: ['./pedibus.attendance.component.css']
})


export class PedibusAttendanceComponent implements OnInit, OnDestroy {
  data: CorsaWrapper;
  linee: Linea[] = [];
  error: string;
  exportControl: FormControl;
  dateLineForm: FormGroup;
  message: string;
  selectedData: string;
  classType = 'centeredCard';
  display = true;

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
                  this.error = undefined;
                  },
      error1 => {
        this.error = 'Operazione Fallita';
      }
      );

    this.exportControl = new FormControl('', [Validators.required]);
    this.dateLineForm = this.formBuilder.group({
      date: ['', [Validators.required]],
      line: ['', [Validators.required]]
    });

    this.websocketService.disconnect();
    this.websocketService.connect();
    this.websocketService.stompClient.heartbeat.outgoing = 20000; // client will send heartbeats every 20000ms
    this.websocketService.stompClient.heartbeat.incoming = 0;     // client does not want to receive heartbeats from the server

    this.websocketService.stompClient.connect({}, () => { // Callback dopo aver effettuato correttamnete la connessione
      const username = JSON.parse(localStorage.getItem('currentUser')).username;

      this.websocketService.stompClient.subscribe('/user/' + username + '/queue/notifications', message => { // Callback nuovo messaggio
        const messageString = JSON.stringify(message);
        this.userService.updateUnreadMessages(message.body);
        this.websocketService.showBanner();

        if (this.dateLineForm.invalid) {
          this.error = 'I valori inseriti sono errati';
          return;
        }
        this.data = undefined;
        this.message = undefined;
        this.classType = 'leftCard';

        const linea = this.f.line.value;
        const dataSelezionata = this.formatDate(this.f.date.value);

        this.attendanceService.getCorsa(linea as string, dataSelezionata).subscribe(x => {
          this.data = x;
          this.error = undefined;
          this.selectedData = this.formatDateDashed(this.f.date.value);
        }, error1 => {
          this.error = 'Operazione Fallita';
          this.classType = 'centeredCard';
        });
      });
    });
  }

  get fExport() { return this.exportControl; }
  get f() { return this.dateLineForm.controls; }

  getCorsa() {

    if (this.dateLineForm.invalid) {
      this.error = 'I valori inseriti sono errati';
      return;
    }
    this.data = undefined;
    this.message = undefined;
    this.classType = 'leftCard';

    const linea = this.f.line.value;
    const dataSelezionata = this.formatDate(this.f.date.value);

    this.attendanceService.getCorsa(linea as string, dataSelezionata).subscribe(x => {
      this.data = x;
      this.error = undefined;
      this.selectedData = this.formatDateDashed(this.f.date.value);
    }, error1 => {
      this.error = 'Operazione Fallita';
      this.classType = 'centeredCard';
    });
  }

  segnaPresente($event: MouseEvent, bambino: Bambino, verso: string, feramata: Fermata) {
    bambino.presente = (bambino.presente === true) ? false : true;

    if (bambino.prenotato === false) {
      return;
    }

    this.attendanceService.cambiaStato(bambino, this.data.linea, this.data.date, verso.toUpperCase(),
      feramata).subscribe((response) => {
        // do something with the response
        console.log('Response is: ', response);

      },
      (error) => {
        // catch the error
        this.error = 'Operazione fallita';
      }

    );
  }

  private formatDate(today: Date) {
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return dd + mm + yyyy;
  }

  private formatDateDashed(data: Date) {
    const dd = String(data.getDate()).padStart(2, '0');
    const mm = String(data.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = data.getFullYear();
    return mm + '-' + dd + '-' + yyyy;
  }

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

  ngOnDestroy(): void {
    this.websocketService.stompClient.unsubscribe();
  }
}


