import {Component, Injectable, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Linea, Fermata, Data, Bambino, Corsa, AttendanceService} from '../Services/pedibus.attendance.service';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../Services/authentication.service';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import exportFromJSON from 'export-from-json'
import {User} from '../Models/User';

@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.attendance.component.html',
  styleUrls: ['./pedibus.attendance.component.css']
})


export class PedibusAttendanceComponent implements OnInit {
  data: Data;
  linee: Linea[] = [];
  error: string;
  exportControl: FormControl;

  constructor(private attendanceService: AttendanceService,
              private authenticationService: AuthenticationService,
              private router: Router) {

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
        this.error = 'Operazione -getLines OnInit- Fallita';
      }
      );
    this.attendanceService.getCorsa('Rossa', this.formatDate(new Date())).subscribe(
      x => {
        this.data = x;
        this.error = undefined;
      }, error1 => {
        this.error = 'Operazione -getCorsa OnInit- Fallita';
      });

    this.exportControl = new FormControl('', [Validators.required]);
  }

  get f() { return this.exportControl; }

  getCorsa(linea: string, data: string) {
    // this.selectedDate = data;
    this.attendanceService.getCorsa(linea, data).subscribe(x => {
      this.data = x;
      this.error = undefined;
    }, error1 => {
      this.error = 'Operazione -getCorsa- Fallita';
    });
  }

  cambiaLinea($event: MatRadioChange) {
    console.log($event.value);
    console.log(this.formatDate(this.data.date));
    this.attendanceService.getCorsa($event.value, this.formatDate(this.data.date)).subscribe(x => {
      this.data = x;
      this.error = undefined;
    }, error1 => {
      this.error = 'Operazione -getCorsa [cambiaLinea]- Fallita';
    });
    console.log(this.data);
  }

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

  nextDay() {
    // andare avanti di un giorno
    const followingDay = new Date(this.data.date.getTime() + 86400000); // + 1 day in ms
    this.getCorsa(this.data.linea, this.formatDate(followingDay));
  }

  previousDay() {
    // andare indietro di un giorno
    const followingDay = new Date(this.data.date.getTime() - 86400000); // + 1 day in ms
    this.getCorsa(this.data.linea, this.formatDate(followingDay));
  }

  cambiaGiorno($event: PageEvent) {
    ($event.pageIndex - $event.previousPageIndex > 0) ? this.nextDay() : this.previousDay();
  }

  private formatDate(today: Date) {
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return dd + mm + yyyy;
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
}


