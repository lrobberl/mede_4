import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {AdminService} from '../Services/admin.service';

@Component({
  selector: 'app-pedibus-admin-registraton',
  templateUrl: './admin.register.component.html',
  styleUrls: ['./admin.register.component.css']
})

export class AdminRegisterComponent implements OnInit {
  adminRegisterForm: FormGroup;
    error: string;
  // submitted = false;
  loading = false;
  returnUrl: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private adminService: AdminService,
              private authenticationService: AuthenticationService) {
    if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login'], );
    }
  }

  ngOnInit(): void {
    this.adminRegisterForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      // tslint:disable-next-line:max-line-length
      role: ['', [Validators.required]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.adminRegisterForm.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.adminRegisterForm.invalid) {
      return;
    }

    this.loading = true;
    this.adminService.registerUser(this.f.username.value, this.f.role.value)
       .subscribe(user => {
          this.router.navigate(['/'], { queryParams: { newUserCreated: true }});
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
    } else if (campo === 'role') {
      return this.f.role.hasError('required') ? 'Role is required' :
          '';
    }
  }
}
