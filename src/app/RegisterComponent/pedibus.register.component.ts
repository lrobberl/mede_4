import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {AuthenticationService} from '../Services/authentication.service';
import {MustMatch} from '../Utils/must-match.validator';


@Component({
  selector: 'app-pedibus-register',
  templateUrl: './pedibus.register.component.html',
  styleUrls: ['./pedibus.register.component.css']
})

export class PedibusRegisterComponent implements OnInit {

  registerForm: FormGroup;
  hidepass1 = true;
  hidepass2 = true;
  error: string;
  emailPresent = false;
  loading = false;
  emailPresenceMessage: 'Email inserita è già presente nel sistema';

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      // tslint:disable-next-line:max-line-length
      password: ['', [Validators.required,
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]],

      confermaPassword: ['', [Validators.required,
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]],

      firstName: ['', [Validators.required,
        Validators.pattern('^[a-zA-Z]{2,40}$')]],

      lastName: ['', [Validators.required,
        Validators.pattern('^[a-zA-Z]{2,40}$')]]
    }, {
      validator: MustMatch('password', 'confermaPassword')
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get f() { return this.registerForm.controls; }

  getErrorMessage(campo: string) {
    if (campo === 'username') {
      return this.f.username.hasError('required') ? 'Username is required' :
        this.f.username.hasError('email') ? 'Not a valid email' :
          '';
    } else if (campo === 'password') {
      return this.f.password.hasError('required') ? 'Password is required' :
        this.f.password.hasError('pattern') ? 'Not a valid password' :
          '';
    } else if (campo === 'confermaPassword') {
      return this.f.confermaPassword.hasError('required') ? 'Password confirm is required' :
        this.f.confermaPassword.hasError('pattern') ? 'Not a valid password confirm' :
          this.f.confermaPassword.hasError('MustMatch') ? 'Passwords must match' :
          '';
    } else if (campo === 'firstName') {
      return this.f.firstName.hasError('required') ? 'First name is required' :
        this.f.firstName.hasError('pattern') ? 'Not a valid first name' :
          '';
    } else if (campo === 'lastName') {
      return this.f.lastName.hasError('required') ? 'Last name is required' :
        this.f.lastName.hasError('pattern') ? 'Not a valid last name' :
          '';
    }
  }

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.f.firstName.value, this.f.lastName.value, this.f.username.value,
      this.f.password.value, this.f.confermaPassword.value)
      .subscribe(
        data => {
          this.router.navigate(['/login'], { queryParams: { registered: true }});
        },
        error => {
          this.loading = false;
          this.error = error;
        });
  }


  getIsEmailPresent() {
    return this.emailPresent;
  }

  isEmailPresent() {
    if (!this.f.username.invalid) {
      this.userService.checkEmailPresent(this.f.username.value).subscribe(res => {
        console.log('Il valore attuale di email present è' + this.emailPresent);
        console.log('Sono entrato nel register ts isEmailPresent');

        if (res.presente === 'true') {
          this.emailPresent = true;
        } else {
          this.emailPresent = false;
        }
        console.log('Il valore cambiato di email present è' + this.emailPresent);
      });
    }
  }


}





/*
  checkForInputs() {
    if (this.firstName.invalid || this.lastName.invalid || this.email.invalid || this.password.invalid || this.password2.invalid
        || this.checkPasswords()) {
      return false;
    }
    return true;
  }

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
