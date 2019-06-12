import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../pedibus.user.service';
import {Router} from '@angular/router';
import * as moment from 'moment';


@Component({
  selector: 'app-pedibus-login',
  templateUrl: './pedibus.login.component.html',
  styleUrls: ['./pedibus.login.component.css']
})

export class PedibusLoginComponent {

  hidepass = true;
  error: string;

  constructor(private userService: UserService, private router: Router) {
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',
    [Validators.required,
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]);

  getErrorMessage(campo: string) {
    if (campo === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
          '';
    } else if (campo === 'password') {
      return this.password.hasError('required') ? 'You must enter a value' :
        this.password.hasError('pattern') ? 'Not a valid password' :
          '';
    }
  }

    onSubmit() {
    this.userService.login(this.email.value, this.password.value)
      .subscribe(token => {
          localStorage.setItem('id_token', token);
          // this.router.navigate(['/myPage'], { queryParams: { registered: true }});
        },
        error => {
          this.error = error;
        });
  }

  checkForInputs() {
    return !(this.email.invalid || this.password.invalid);
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

/*
loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('',
    [Validators.required,
      Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_£?".:,;ùèéòì=à!@#\\+\\$%\\^&\\*])(?!.*\\s).{8,30}$')]),
  });
 */
