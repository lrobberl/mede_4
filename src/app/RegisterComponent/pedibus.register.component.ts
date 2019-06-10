import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UserService} from '../pedibus.user.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-pedibus-register',
  templateUrl: './pedibus.register.component.html',
  styleUrls: ['./pedibus.register.component.css']
})

export class PedibusRegisterComponent {

  hidepass1 = true;
  hidepass2 = true;
  error: string;
  emailAlreadyPresent = false;

  constructor(private userService: UserService, private router: Router) {
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',
    [Validators.required,
                   Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]);

  password2 = new FormControl('',
    [Validators.required,
                   Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]);

  firstName = new FormControl('', [
                Validators.required,
                Validators.pattern('^[a-zA-Z]{2,40}$')]);

  lastName = new FormControl('', [
                Validators.required,
                Validators.pattern('^[a-zA-Z]{2,40}$')]);

  getErrorMessage(campo: string) {
    if (campo === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
          '';
    } else if (campo === 'password') {
      return this.password.hasError('required') ? 'You must enter a value' :
        this.password.hasError('pattern') ? 'Not a valid password' :
          '';
    } else if (campo === 'password2') {
      return this.password2.hasError('required') ? 'You must enter a value' :
        this.password2.hasError('pattern') ? 'Not a valid password' :
          '';
    } else if (campo === 'firstName') {
      return this.firstName.hasError('required') ? 'You must enter a value' :
        this.firstName.hasError('pattern') ? 'Not a valid first name' :
          '';
    } else if (campo === 'lastName') {
      return this.lastName.hasError('required') ? 'You must enter a value' :
        this.lastName.hasError('pattern') ? 'Not a valid last name' :
          '';
    }
  }

  checkPasswords() {
    return !(this.password.value === this.password2.value);
  }

  onSubmit() {
    this.userService.register(this.firstName.value, this.lastName.value, this.email.value, this.password.value, this.password2.value)
      .subscribe(
        data => {
          this.router.navigate(['/login'], { queryParams: { registered: true }});
        },
        error => {
          this.error = error;
        });
  }

  checkForInputs() {
    if (this.firstName.invalid || this.lastName.invalid || this.email.invalid || this.password.invalid || this.password2.invalid
        || this.checkPasswords()) {
      return false;
    }
    return true;
  }

  isEmailPresent(email: string) {
    if (!this.email.invalid) {
      let result = '';
      this.userService.checkEmailPresent(email).subscribe(res => { result = res; });
      this.emailAlreadyPresent = (result === 'true');
    }
  }
}



/*
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

  function passwordValidator(control: FormGroup): ValidationErrors | null {
  const password = control.get('password');
  const password2 = control.get('password2');

  const ret = password === password2 ? null : { passwordNotMatching: true};
  if (ret) { console.log(`${password.value} === ${password2.value}`, 'Le password fornite non coincidono'); }

  return ret;
}
   */
