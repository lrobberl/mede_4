import {Component, OnInit} from '@angular/core';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {Linea, Fermata, Data, Bambino, Corsa, HttpService} from './pedibusHTTP.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-pedibus-attendance',
  templateUrl: './pedibus.attendance.component.html',
  styleUrls: ['./pedibus.attendance.component.css']
})

export class PedibusAttendanceComponent implements OnInit {
  title = 'Esercitazione - #5';
  data: Data;
  selectedDate: string;
  linee: Linea[];

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.httpService.getLines().subscribe(x => {this.linee = x; });
    this.setCurrentDate();
    this.httpService.getCorsa('Rossa', this.selectedDate).subscribe(x => {this.data = x; });
  }

  setCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    this.selectedDate = dd + mm + yyyy;
  }
  getCorsa(linea: string, data: string) {
    this.selectedDate = data;
    this.httpService.getCorsa(linea, data).subscribe(x => {this.data = x; });
  }

  cambiaLinea($event: MatRadioChange) {
    this.httpService.getCorsa(this.linee[$event.value].Nome, this.selectedDate).subscribe(x => {this.data = x; });
  }

  segnaPresente($event: MouseEvent, bambino: Bambino) {
    bambino.presente = (bambino.presente === true) ? false : true;
    // todo: dove va inserita la .subscribe()? Nel componente o nel servizio? E cosa ci inseriamo dentro?
    this.httpService.cambiaStato(bambino).subscribe((response) => {
        // do something with the response
        console.log('Response is: ', response);
      },
      (error) => {
        // catch the error
        console.error('An error occurred, ', error);
      }

    );
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


