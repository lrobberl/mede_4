import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UserService} from '../pedibus.user.service';
import {Router} from '@angular/router';


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
      .subscribe(
        data => {
          this.router.navigate(['/login'], { queryParams: { registered: true }});
        },
        error => {
          this.error = error;
        });
  }

  checkForInputs() {
    if (this.email.invalid || this.password.invalid) {
      return false;
    }
    return true;
  }
}
