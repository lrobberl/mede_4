import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {AdminService} from '../Services/admin.service';
import {Observable} from 'rxjs';
import {User} from '../Models/User';
import {Linea} from '../Models/Linea';
import {AttendanceService} from '../Services/pedibus.attendance.service';
import {MatCheckboxChange} from '@angular/material';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-pedibus-admin-user-list',
  templateUrl: './admin.change.role.component.html',
  styleUrls: ['./admin.change.role.component.css']
})

export class ChangeRoleComponent implements OnInit {
  changeRoleForm: FormGroup;
  error: string;
  // submitted = false;
  loading = false;
  returnUrl: string;
  // urlParam: string;
  users$: Observable<User[]>;
  linee$: Observable<Linea []>;
  public lineeSelezionate: string[] = [];
  lineeCount = 0;
  checkIfRoleChanged = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private attendanceService: AttendanceService,
              private adminService: AdminService,
              private authenticationService: AuthenticationService,
              private breakpointObserver: BreakpointObserver) {
    if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login'], );
    }
  }

  ngOnInit(): void {
    this.changeRoleForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      // tslint:disable-next-line:max-line-length
      role: ['', [Validators.required]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
    if (this.router.url === '/changeUserRole?changedRole:true=') {
      this.checkIfRoleChanged = true;
    }
    this.linee$ = this.attendanceService.getLines();
    // Get all users
    this.users$ = this.adminService.getAllAdminsAndAccompagnatori();
    // this.urlParam = this.route.snapshot.paramMap.get('id');
  }

  // convenience getter for easy access to form fields
  get f() { return this.changeRoleForm.controls; }

  onSubmit() {
    // this.submitted = true;
    // stop here if form is invalid
    if (this.changeRoleForm.invalid) {
      return;
    }

    this.loading = true;
    this.adminService.changeUserRole(this.f.username.value, this.f.role.value, this.lineeSelezionate)
      .subscribe(user => {
          // this.router.navigate(['/'], { queryParams: { newUserCreated: true }});
          window.location.assign('/changeUserRole?changedRole:true');
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

  onChangeCategory($event: MatCheckboxChange, linea: string) { // Use appropriate model type instead of any
    // this.tempArr.lineeSelezionate.push(linea);
    if ($event.checked) {
      this.lineeSelezionate.push(linea);
      this.lineeCount += 1;
      // console.log(this.lineeCount);
    } else {
      const index = this.lineeSelezionate.indexOf(linea, 0);
      if (index > -1) {
        this.lineeSelezionate.splice(index, 1);
        this.lineeCount -= 1;
        // console.log(this.lineeCount);
      }
    }

  }
}

