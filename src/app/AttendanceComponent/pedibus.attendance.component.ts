import {Component, Injectable, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Linea, Fermata, Data, Bambino, Corsa, AttendanceService} from '../pedibus.attendance.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.attendance.component.html',
  styleUrls: ['./pedibus.attendance.component.css']
})


export class PedibusAttendanceComponent implements OnInit {
  title = 'Esercitazione - #5';
  data: Data;
  prova$: Observable<Data>;
  selectedLine: string;
  linee: Linea[];
  radioSelected = 'Rossa';

  constructor(private attendanceService: AttendanceService) {
  }

  ngOnInit() {
    this.attendanceService.getLines().subscribe(x => {this.linee = x; });
    this.setCurrentLine('Rossa');
    this.attendanceService.getCorsa(this.selectedLine, this.formatDate(new Date())).subscribe(x => {this.data = x; });
    // this.prova$ = this.httpService.getCorsa(this.selectedLine, this.formatDate(new Date()));
  }
  setCurrentLine(linea: string) {
    this.selectedLine = linea;
  }

  getCorsa(linea: string, data: string) {
    // this.selectedDate = data;
    this.attendanceService.getCorsa(linea, data).subscribe(x => {this.data = x; });
  }

  cambiaLinea($event: MatRadioChange) {
    this.attendanceService.getCorsa($event.value, this.formatDate(this.data.date)).subscribe(x => {this.data = x; });
  }

  segnaPresente($event: MouseEvent, bambino: Bambino, verso: string, feramata: Fermata) {
    bambino.presente = (bambino.presente === true) ? false : true;

    this.attendanceService.cambiaStato(bambino, this.selectedLine, this.data.date, verso, feramata).subscribe((response) => {
        // do something with the response
        console.log('Response is: ', response);
      },
      (error) => {
        // catch the error
        console.error('An error occurred, ', error);
      }

    );
  }

  nextDay() {
    // andare avanti di un giorno
    const followingDay = new Date(this.data.date.getTime() + 86400000); // + 1 day in ms
    this.getCorsa(this.selectedLine, this.formatDate(followingDay));
  }

  previousDay() {
    // andare indietro di un giorno
    const followingDay = new Date(this.data.date.getTime() - 86400000); // + 1 day in ms
    this.getCorsa(this.selectedLine, this.formatDate(followingDay));
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

}


