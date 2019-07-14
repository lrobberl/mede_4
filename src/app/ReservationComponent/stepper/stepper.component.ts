import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Bambino} from '../../Models/Bambino';
import {UserService} from '../../Services/pedibus.user.service';
import {Linea} from '../../Models/Linea';
import {AttendanceService} from '../../Services/pedibus.attendance.service';
import {FermataShort} from '../../Models/FermataShort';
import {FermataGroup} from '../../Models/FermataGroup';
import {range} from 'rxjs';
import {MatCheckboxChange} from '@angular/material';

/**
 * @title Stepper vertical
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})



export class StepperComponent implements OnInit {
  monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
  dayNames = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  corsa1: FormGroup;
  corsa2: FormGroup;
  corsa3: FormGroup;
  corsa4: FormGroup;
  corsa5: FormGroup;
  bambini: Bambino[] = [];
  error: string;
  selected: string;
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

    this.corsa1 = new FormGroup({
      fermateAndata : new FormControl(['']),
      fermateRitorno : new FormControl(['']),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa2 = new FormGroup({
      fermateAndata : new FormControl(['']),
      fermateRitorno : new FormControl(['']),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa3 = new FormGroup({
      fermateAndata : new FormControl(['']),
      fermateRitorno : new FormControl(['']),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa4 = new FormGroup({
      fermateAndata : new FormControl(['']),
      fermateRitorno : new FormControl(['']),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa5 = new FormGroup({
      fermateAndata : new FormControl(['']),
      fermateRitorno : new FormControl(['']),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    /*
    this.secondFormGroup = this.formBuilder.group({
      fermateAndata: ['', Validators.required],
      fermateRitorno: ['', Validators.required],
      checkBoxAndata: ['', Validators.required],
      checkBoxRitorno: ['', Validators.required],
    });

    this.secondFormGroup = new FormGroup({
      corse1: new FormGroup({
        fermateAndata : new FormControl(['']),
        fermateRitorno : new FormControl(['']),
        checkBoxAndata : new FormControl(['']),
        checkBoxRitorno : new FormControl(['']),
      }),
      corse2: new FormGroup({
        fermateAndata : new FormControl(['']),
        fermateRitorno : new FormControl(['']),
        checkBoxAndata : new FormControl(['']),
        checkBoxRitorno : new FormControl(['']),
      }),
      corse3: new FormGroup({
        fermateAndata : new FormControl(['']),
        fermateRitorno : new FormControl(['']),
        checkBoxAndata : new FormControl(['']),
        checkBoxRitorno : new FormControl(['']),
      }),
      corse4: new FormGroup({
        fermateAndata : new FormControl(['']),
        fermateRitorno : new FormControl(['']),
        checkBoxAndata : new FormControl(['']),
        checkBoxRitorno : new FormControl(['']),
      }),
      corse5: new FormGroup({
        fermateAndata : new FormControl(['']),
        fermateRitorno : new FormControl(['']),
        checkBoxAndata : new FormControl(['']),
        checkBoxRitorno : new FormControl(['']),
      })
    });
     */
    this.userService.getFigli().subscribe(res => {
      this.bambini = res;
    }, error1 => {
      this.error = 'Operazione -getFigli- fallita';
    });

    this.today = new Date();
    this.next5Days.push(this.today);
    this.next5Days.push(new Date(this.today.getTime() + 86400000));
    this.next5Days.push(new Date(this.today.getTime() + (86400000 * 2)));
    this.next5Days.push(new Date(this.today.getTime() + 86400000 * 3));
    this.next5Days.push(new Date(this.today.getTime() + 86400000 * 4));
    // TODO: verificare se e domenica e saltare il giorno
  }

  get firstForm() {
    return this.firstFormGroup.controls;
  }

  get secondForm() {
    return this.secondFormGroup.controls;
  }

  prenotaFiglio() {
    console.log('Prenotato il figlio');
  }

  getFermate() {
    console.log(this.firstForm.childrenControl.value);

    this.attendanceService.getFermateGroupByLinea().subscribe(res => {
      this.fermateGroups = res;
      res.forEach(linea => {
        linea.fermate.forEach(fermata => {
          if (fermata.id === this.firstForm.childrenControl.value) {
            this.fermataDefault = fermata;
            this.corsa1.controls.fermateAndata.setValue(fermata);
            this.corsa1.controls.fermateRitorno.setValue(fermata);
            this.corsa2.controls.fermateAndata.setValue(fermata);
            this.corsa2.controls.fermateRitorno.setValue(fermata);
            this.corsa3.controls.fermateAndata.setValue(fermata);
            this.corsa3.controls.fermateRitorno.setValue(fermata);
            this.corsa4.controls.fermateAndata.setValue(fermata);
            this.corsa4.controls.fermateRitorno.setValue(fermata);
            this.corsa5.controls.fermateAndata.setValue(fermata);
            this.corsa5.controls.fermateRitorno.setValue(fermata);
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

  getGroup(i: number) {
    if (i === 0) {
      return this.corsa1 as FormGroup;
    } else if (i === 1) {
      return this.corsa2 as FormGroup;
    } else if (i === 2) {
      return this.corsa3 as FormGroup;
    } else if (i === 3) {
      return this.corsa4 as FormGroup;
    } else if (i === 4) {
      return this.corsa5 as FormGroup;
    }
  }

  setVersoAndata($event: MatCheckboxChange, i: number) {
    if ($event.checked) {
      this.getGroup(i).controls.checkBoxAndata.setValue(1);
    } else {
      this.getGroup(i).controls.checkBoxAndata.setValue(0);
    }
  }
  setVersoRitorno($event: MatCheckboxChange, i: number) {
    if ($event.checked) {
      this.getGroup(i).controls.checkBoxRitorno.setValue(1);
    } else {
      this.getGroup(i).controls.checkBoxRitorno.setValue(0);
    }
  }
}
