import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';

@Component({
  selector: 'app-pedibus-login',
  templateUrl: './pedibus.login.component.html',
  styleUrls: ['./pedibus.login.component.css']
})

export class PedibusLoginComponent implements OnInit {
  loginForm: FormGroup;
  hidepass = true;
  error: string;
  // submitted = false;
  loading = false;
  returnUrl: string;

  constructor(private userService: UserService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      // tslint:disable-next-line:max-line-length
      password: ['', [Validators.required,
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .subscribe(user => {
          // localStorage.setItem('id_token', token);
          // Upon success, navigate to homepage
          // this.router.navigate(['/'], { queryParams: { logged: true }});
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  getErrorMessage(campo: string) {
    if (campo === 'username') {
      return this.f.username.hasError('required') ? 'Username is required' :
        this.f.username.hasError('email') ? 'Username must be a valid email' :
          '';
    } else if (campo === 'password') {
      return this.f.password.hasError('required') ? 'Password is required' :
        this.f.password.hasError('pattern') ? 'Invalid password' :
          '';
    }
  }
}

/*
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',
  [Validators.required,
  Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]);



  checkForInputs() {
    return !(this.password.invalid || this.email.invalid);
  }
  */


/*
loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',
    [Validators.required,
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]),
  });
 */
