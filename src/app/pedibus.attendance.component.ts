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
  data$: Observable<Data>;
  selectedDate: string;
  linee$: Observable<Linea[]>;

  constructor(private httpService: HttpService) {
  }

  ngOnInit() {
    this.linee$ = this.httpService.getLines();
    this.setCurrentDate();
    this.data$ = this.httpService.getCorsa('Rossa', this.selectedDate);
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
    this.data$ = this.httpService.getCorsa(linea, data);
  }

  cambiaLinea($event: MatRadioChange) {
    this.data$ = this.httpService.getCorsa(this.linee$[$event.value], this.selectedDate);
  }

  segnaPresente($event: MouseEvent, bambino: Bambino) {
    bambino.presente = (bambino.presente === true) ? false : true;
    // todo: dove va inserita la .subscrive()? Nel componente o nel servizio? E cosa ci inseriamo dentro?
    this.httpService.cambiaStato(bambino).subscribe();
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


