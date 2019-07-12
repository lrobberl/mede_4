import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {AdminService} from '../Services/admin.service';
import {Observable} from 'rxjs';
import {Line} from 'tslint/lib/verify/lines';
import {AttendanceService} from '../Services/pedibus.attendance.service';
import {MatCheckboxChange, PageEvent} from '@angular/material';
import {Linea} from '../Models/Linea';

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
  linee$: Observable<Linea []>;
  // tempArr: any = { lineeSelezionate: [] };
  public lineeSelezionate: string[] = [];
  lineeCount = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private adminService: AdminService,
              private authenticationService: AuthenticationService,
              private attendanceService: AttendanceService) {
    if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login'], );
    }
  }

  ngOnInit(): void {
    this.adminRegisterForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      // tslint:disable-next-line:max-line-length
      role: ['', [Validators.required]],
      // lineeSelezionate: ['', [Validators.required]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    // get all lines
    this.linee$ = this.attendanceService.getLines();
  }

  // convenience getter for easy access to form fields
  get f() { return this.adminRegisterForm.controls; }

  onSubmit() {
    // this.submitted = true;

    // stop here if form is invalid
    if (this.adminRegisterForm.invalid || (this.f.role.value === 'SYSTEM_ADMIN' && this.lineeCount === 0)) {
      return;
    }

    this.loading = true;
    this.adminService.registerUser(this.f.username.value, this.f.role.value, this.lineeSelezionate)
       .subscribe(res => {
             this.router.navigate(['/'], { queryParams: { newUserCreated: true }});
        },
         error1 => {
           this.error = 'Operazione Fallita';
           this.loading = false;
         });
  }
  /*
  ,
        error => {
          this.error = error;
          this.loading = false;
        });
   */

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

  onChangeCategory($event: MatCheckboxChange, linea: string) { // Use appropriate model type instead of any
    // this.tempArr.lineeSelezionate.push(linea);
    if ($event.checked) {
      this.lineeSelezionate.push(linea);
      this.lineeCount += 1;
      console.log(this.lineeCount);
    } else {
      const index = this.lineeSelezionate.indexOf(linea, 0);
      if (index > -1) {
        this.lineeSelezionate.splice(index, 1);
        this.lineeCount -= 1;
        console.log(this.lineeCount);
      }
    }

  }
}
