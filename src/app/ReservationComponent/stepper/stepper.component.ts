import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Bambino} from '../../Models/Bambino';
import {UserService} from '../../Services/pedibus.user.service';

/**
 * @title Stepper vertical
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  bambini: Bambino[] = [];
  error: string;
  selected: 'Children selected';

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {

  }

  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      childrenControl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.userService.getFigli().subscribe(res => {
      this.bambini = res;
    }, error1 => {
      this.error = 'Operazione -getFigli- fallita';
    });
  }

  get firstForm() { return this.firstFormGroup.controls; }
  get secondForm() { return this.secondFormGroup.controls; }

  prenotaFiglio() {

  }
}
