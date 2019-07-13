import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Bambino} from '../../Models/Bambino';
import {UserService} from '../../Services/pedibus.user.service';
import {Linea} from '../../Models/Linea';
import {AttendanceService} from '../../Services/pedibus.attendance.service';
import {FermataShort} from '../../Models/FermataShort';
import {FermataGroup} from '../../Models/FermataGroup';
import {range} from 'rxjs';

/**
 * @title Stepper vertical
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})



export class StepperComponent implements OnInit {
  monthNames = [ 'Gen', 'Feb' , 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  bambini: Bambino[] = [];
  error: string;
  selected: 'Children selected';
  linee: Linea[];
  today: Date;
  i: string;
  next5Days: Date[] = [];
  fermateGroups: FermataGroup[] = [];
  fermataDefault: FermataShort;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private attendanceService: AttendanceService) {

  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      childrenControl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      fermateAndata: ['', Validators.required],
      fermateRitorno: ['', Validators.required],
      checkBoxAndata: ['', Validators.required],
      checkBoxRitorno: ['', Validators.required],
    });

    this.userService.getFigli().subscribe(res => {
      this.bambini = res;
    }, error1 => {
      this.error = 'Operazione -getFigli- fallita';
    });

    this.today = new Date();
    this.next5Days.push(this.today);
    this.next5Days.push(new Date(this.today.getTime() + 86400000 ));
    this.next5Days.push(new Date(this.today.getTime() + (86400000 * 2) ));
    this.next5Days.push(new Date(this.today.getTime() + 86400000 * 3));
    this.next5Days.push(new Date(this.today.getTime() + 86400000 * 4));
    // TODO: verificare se e domenica e saltare il giorno
  }

  get firstForm() { return this.firstFormGroup.controls; }
  get secondForm() { return this.secondFormGroup.controls; }

  prenotaFiglio() {

  }

  getFermate() {
    console.log(this.firstForm.childrenControl.value);

    this.attendanceService.getFermateGroupByLinea().subscribe(res => {
      this.fermateGroups = res;
      res.forEach(linea => {
        linea.fermate.forEach( fermata => {
          if (fermata.id === this.firstForm.childrenControl.value) {
            this.fermataDefault = fermata;
          }
        });
      });
    });
  }

  eraseFields() {
    this.fermateGroups = undefined;
    this.fermataDefault = undefined;
  }

  formatDate(data: Date) {
    const day = data.getDate() + 1;
    const monthIndex = data.getMonth();
    const dayIndex = data.getDay();

    return '' + this.dayNames[dayIndex] + '-' + day + '-' + this.monthNames[monthIndex];
  }
}
