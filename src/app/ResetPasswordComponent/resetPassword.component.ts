import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {MustMatch} from '../Utils/must-match.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.css']
})

export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hidepass1 = true;
  hidepass2 = true;
  error: string;
  loading = false;
  returnUrl: string;
  urlParam: string;

  constructor(private userService: UserService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
    /* redirect to home if already logged in
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
     */
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required,
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]],

      confermaPassword: ['', [Validators.required,
        Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]]
    }, {
      validator: MustMatch('password', 'confermaPassword')
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    this.urlParam = this.route.snapshot.paramMap.get('uuid');
    console.log(this.urlParam);
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.resetPassword(this.f.password.value, this.f.confermaPassword.value, this.urlParam)
      .subscribe(res => {
          // Upon success, navigate to homepage
          // this.router.navigate(['/'], { queryParams: { logged: true }});
          if (res === 'B') {
            this.error = 'Bad Request';
            this.loading = false;
          } else {
            this.router.navigate(['/']);
          }
        });
  }
  /*
  ,
        error => {
          this.error = 'Bad Request';
          this.loading = false;
        }
   */

  getErrorMessage(campo: string) {
    if (campo === 'password') {
      return this.f.password.hasError('required') ? 'Password is required' :
        this.f.password.hasError('pattern') ? 'Not a valid password' :
          '';
    } else if (campo === 'confermaPassword') {
      return this.f.confermaPassword.hasError('required') ? 'Password confirm is required' :
        this.f.confermaPassword.hasError('pattern') ? 'Not a valid password confirm' :
          this.f.confermaPassword.hasError('MustMatch') ? 'Passwords must match' :
            '';
    }
  }
}
