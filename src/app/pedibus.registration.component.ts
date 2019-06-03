import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import {MatRadioChange, PageEvent} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

function passwordValidator(control: FormGroup): ValidationErrors | null {
  const password = control.get('password');
  const password2 = control.get('password2');

  const ret = password === password2 ? null : { passwordNotMatching: true};
  if (ret) { console.log(`${password.value} === ${password2.value}`, 'Le password fornite non coincidono'); }

  return ret;
}

@Component({
  selector: 'app-pedibus-registration',
  templateUrl: './pedibus.registration.component.html',
  styleUrls: ['./pedibus.registration.component.css']
})

export class PedibusRegistrationComponent implements OnInit {

  constructor(private fb: FormBuilder) {
  }

  registrationForm = this.fb.group({
    firstName: [Validators.required],
    lastName: ['required', [Validators.required]],
    email: [Validators.required],
    password: [Validators.required],
    password2: [Validators.required],
    // todo: accettazione pricacy manca
  }, {
    validators: passwordValidator,
    // updateOn: 'blur'
  });

  ngOnInit(): void {
  }
}



