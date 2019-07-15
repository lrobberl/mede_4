import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Bambino} from '../../Models/Bambino';
import {UserService} from '../../Services/pedibus.user.service';
import {Linea} from '../../Models/Linea';
import {AttendanceService} from '../../Services/pedibus.attendance.service';
import {FermataShort} from '../../Models/FermataShort';
import {FermataGroup} from '../../Models/FermataGroup';
import {MatCheckboxChange} from '@angular/material';
import {Prenotazione} from '../../Models/Prenotazione';

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
  secondStep: boolean;
  next5Days: Date[] = [];
  fermateGroups: FermataGroup[] = [];
  fermataDefault: FermataShort;
  prenotazioniNext5Days: Prenotazione[] = [];
  fermata: FermataShort;

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
      fermateAndata : new FormControl([]),
      fermateRitorno : new FormControl([]),
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
      fermateAndata : new FormControl([]),
      fermateRitorno : new FormControl([]),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });
    this.corsa5 = new FormGroup({
      fermateAndata : new FormControl(['']),
      fermateRitorno : new FormControl(['']),
      checkBoxAndata : new FormControl([0]),
      checkBoxRitorno : new FormControl([0]),
    });

    this.userService.getFigli().subscribe(res => {
      this.bambini = res;
    }, error1 => {
      this.error = 'Operazione -getFigli- fallita';
    });

    this.createNext5Days();
  }

  get firstForm() {
    return this.firstFormGroup.controls;
  }

  getFermateAndPrenotazioni() {
    // console.log(this.firstForm.childrenControl.value);

    this.attendanceService.getFermateGroupByLinea().subscribe(res => {
      this.fermateGroups = res;
      this.error = undefined;
      res.forEach(linea => {
        linea.fermate.forEach(fermata => {
          if (fermata.id === this.firstForm.childrenControl.value.fermataDefault) {
            this.fermataDefault = fermata;
            this.setFermataDefault(fermata);
          }
        });
      });
    }, error1 => {
      this.error = 'Operazione -getFermateGroupByLinea- fallita';
    });

    this.attendanceService.getPrenotazioniBambino(this.firstForm.childrenControl.value.id as string).subscribe( result => {
      this.prenotazioniNext5Days = result;
      this.setPrenotazioniAttive(result);
      this.secondStep = true;
    }, error1 => {
      this.error = 'Operazione -getPrenotazioniBambino- fallita';
    });
  }

  prenotaFiglio() {
    console.log('Prenotato il figlio');
  }

  eraseFields() {
    this.fermateGroups = undefined;
    this.fermataDefault = undefined;
  }

  formatDate(data: Date) {
    const day = data.getDate();
    const monthIndex = data.getMonth();
    const dayIndex = data.getDay() - 1;

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

  setFermataDefault(fermata: FermataShort) {
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

  private createNext5Days() {
    let count = 0;
    let multiplier = 1;

    this.today = new Date();
    if (this.dayNames[this.today.getDay() - 1] === 'Domenica') {
      this.today = new Date(this.today.getTime() + 86400000);
    }
    this.next5Days.push(this.today);

    while (count < 4) {
      let day = new Date(this.today.getTime() + (86400000 * multiplier));
      if (this.dayNames[day.getDay() - 1] === 'Domenica') {
        multiplier += 1;
        day = new Date(this.today.getTime() + (86400000 * multiplier));
      }
      this.next5Days.push(day);

      count += 1;
      multiplier += 1;
    }
  }

  private setPrenotazioniAttive(prenotazioni: Prenotazione[]) {
    const today = this.today;
    let i = 0;
    prenotazioni.forEach( prenotazione => {
        const curDate = prenotazione.data;
        const a = curDate.getTime() - today.getTime();
        const diff = Math.abs(curDate.getTime() - today.getTime());
        const diffDays = Math.floor(diff / (86400000));

        // Get del corrispondente form {corsa1, corsa2, ...} in base alla data
        this.prenotazioniNext5Days[i].corsaIndex = diffDays;
        const id = prenotazione.fermata.id;

        this.fermateGroups.forEach( group => {
          group.fermate.forEach( f => {
            if (f.id === id) {
              this.fermata = f;
            }
          });
        });

        if (prenotazione.verso === 'ANDATA') {
          if (diffDays === 0) {
            this.corsa1.controls.fermateAndata.setValue(this.fermata as FermataShort);
            this.corsa1.controls.checkBoxAndata.setValue(1);
          } else if (diffDays === 1) {
            this.corsa2.controls.fermateAndata.setValue(this.fermata as FermataShort);
            this.corsa2.controls.checkBoxAndata.setValue(1);
          } else if (diffDays === 2) {
            this.corsa3.controls.fermateAndata.setValue(this.fermata as FermataShort);
            this.corsa3.controls.checkBoxAndata.setValue(1);
          } else if (diffDays === 3) {
            this.corsa4.controls.fermateAndata.setValue(this.fermata as FermataShort);
            this.corsa4.controls.checkBoxAndata.setValue(1);
          } else if (diffDays === 4) {
            this.corsa5.controls.fermateAndata.setValue(this.fermata as FermataShort);
            this.corsa5.controls.checkBoxAndata.setValue(1);
          }
        } else if (prenotazione.verso === 'RITORNO') {
          if (diffDays === 0) {
            this.corsa1.controls.fermateRitorno.setValue(this.fermata as FermataShort);
            this.corsa1.controls.checkBoxRitorno.setValue(1);
          } else if (diffDays === 1) {
            this.corsa2.controls.fermateRitorno.setValue(this.fermata as FermataShort);
            this.corsa2.controls.checkBoxRitorno.setValue(1);
          } else if (diffDays === 2) {
            this.corsa3.controls.fermateRitorno.setValue(this.fermata as FermataShort);
            this.corsa3.controls.checkBoxRitorno.setValue(1);
          } else if (diffDays === 3) {
            this.corsa4.controls.fermateRitorno.setValue(this.fermata as FermataShort);
            this.corsa4.controls.checkBoxRitorno.setValue(1);
          } else if (diffDays === 4) {
            this.corsa5.controls.fermateRitorno.setValue(this.fermata as FermataShort);
            this.corsa5.controls.checkBoxRitorno.setValue(1);
          }
        }
        i += 1;
    });
  }

  checkAndata(i: number) {
    return this.getGroup(i).controls.checkBoxAndata.value === 1;
  }
  checkRitorno(i: number) {
    return this.getGroup(i).controls.checkBoxAndata.value === 1;
  }

  checkFermataAndata(i: number) {
    const a = this.getGroup(i).controls.fermateAndata.value;
    return this.getGroup(i).controls.fermateAndata.value;
  }

  checkFermataRitorno(i: number) {
    const a = this.getGroup(i).controls.fermateRitorno.value;
    return this.getGroup(i).controls.fermateRitorno.value;
  }
}
