import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Linea, Fermata, Data, Bambino, Corsa, HttpService} from './pedibusHTTP.service';

@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.attendance.component.html',
  styleUrls: ['./pedibus.attendance.component.css']
})

export class PedibusAttendanceComponent implements OnInit {
  title = 'Esercitazione - #5';
  data: Data;
  selectedLine: string;
  linee: Linea[];

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.httpService.getLines().subscribe(x => {this.linee = x; });
    this.setCurrentLine('Rossa');
    this.httpService.getCorsa(this.selectedLine, this.formatDate(new Date())).subscribe(x => {this.data = x; });
  }
  setCurrentLine(linea: string) {
    this.selectedLine = linea;
  }

  getCorsa(linea: string, data: string) {
    // this.selectedDate = data;
    this.httpService.getCorsa(linea, data).subscribe(x => {this.data = x; });
  }

  cambiaLinea($event: MatRadioChange) {
    this.httpService.getCorsa(this.linee[$event.value].Nome, this.formatDate(this.data.date)).subscribe(x => {this.data = x; });
  }

  segnaPresente($event: MouseEvent, bambino: Bambino, verso: string, feramata: Fermata) {
    bambino.presente = (bambino.presente === true) ? false : true;
    // todo: dove va inserita la .subscribe()? Nel componente o nel servizio? E cosa ci inseriamo dentro?
    this.httpService.cambiaStato(bambino, this.selectedLine, this.data.date, verso, feramata).subscribe((response) => {
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
    const newDate = this.data.date;
    newDate.setDate(newDate.getDate() + 1);
    this.getCorsa(this.formatDate(newDate), this.selectedLine);
  }

  previousDay() {
    // andare indietro di un giorno
    const newDate = this.data.date;
    newDate.setDate(newDate.getDate() - 1);
    this.getCorsa(this.formatDate(newDate), this.selectedLine);
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


