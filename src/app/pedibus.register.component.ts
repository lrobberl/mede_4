import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';


function passwordValidator(control: FormGroup): ValidationErrors | null {
  const password = control.get('password');
  const password2 = control.get('password2');

  const ret = password === password2 ? null : { passwordNotMatching: true};
  if (ret) { console.log(`${password.value} === ${password2.value}`, 'Le password fornite non coincidono'); }

  return ret;
}

@Component({
  selector: 'app-pedibus-register',
  templateUrl: './pedibus.register.component.html',
  styleUrls: ['./pedibus.register.component.css']
})

export class PedibusRegisterComponent implements OnInit {

  registrationForm: FormGroup;
  submitted: boolean;
  // error: string;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [Validators.required, Validators.maxLength(30), Validators.minLength(2)],
      lastName: ['required', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      email: [Validators.required, Validators.email, Validators.maxLength(30), Validators.minLength(2)],
      password: [Validators.required, Validators.pattern('/^[a-zA-Z0-9\\_\\*\\-\\+\\!\\?\\,\\:\\;\\.\\xE0\\xE8\\xE9\\xF9\\xF2\\' +
        'xEC\x27]{6,12}/'), Validators.maxLength(30)],
      password2: [Validators.required, Validators.pattern('/^[a-zA-Z0-9\\_\\*\\-\\+\\!\\?\\,\\:\\;\\.\\xE0\\xE8\\xE9\\xF9\\xF2\\' +
        'xEC\x27]{6,12}/'), Validators.maxLength(30)],
      // todo: accettazione pricacy mancante
    }, {
      validator: passwordValidator,
      // updateOn: 'blur'
    });


    this.submitted = false;
  }



  onSubmit() {

    /*
    this.submitted = true;

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }

    this.userService.register(this.registrationForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login'], { queryParams: { registered: true }});
        },
        error => {
          this.error = error;
        });
     */
  }

  get f() { return this.registrationForm.controls; }
}



