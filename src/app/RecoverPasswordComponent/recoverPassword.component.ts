import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recoverPassword.component.html',
  styleUrls: ['./recoverPassword.component.css']
})

export class RecoverPasswordComponent implements OnInit {
  recoverPasswordForm: FormGroup;
  hidepass = true;
  error: string;
  // submitted = false;
  loading = false;
  returnUrl: string;
  message = '';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private userService: UserService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private breakpointObserver: BreakpointObserver) {
    /* redirect to home if already logged in
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
     */
  }

  ngOnInit(): void {
    this.recoverPasswordForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.recoverPasswordForm.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.recoverPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.recoverPassword(this.f.username.value)
      .subscribe(res => {
        this.error = undefined;
        this.message = 'E\' stata inviata una email all\'indirizzo specificato';
        this.loading = false;
          // Upon success, navigate to homepage
          // this.router.navigate(['/'], { queryParams: { logged: true }});
        }, error1 => {
        this.error = 'Invalid Username/email';
        this.loading = false;
        this.message = '';
      });
  }

  getErrorMessage(campo: string) {
    if (campo === 'username') {
      return this.f.username.hasError('required') ? 'Username is required' :
        this.f.username.hasError('email') ? 'Username must be a valid email' :
          '';
    }
  }
}
