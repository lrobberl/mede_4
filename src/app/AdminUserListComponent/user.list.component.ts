import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../Services/pedibus.user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../Services/authentication.service';
import {AdminService} from '../Services/admin.service';
import {Observable} from 'rxjs';
import {User} from '../Models/User';

@Component({
  selector: 'app-pedibus-admin-user-list',
  templateUrl: '../ComunicationComponent/user.list.component.html',
  styleUrls: ['./user.list.component.css']
})

export class UserListComponent implements OnInit {
  users: User[];
  // users$: Observable<User[]>;
  displayedColumns: string[] = ['id', 'username', 'role', 'status'];
  error = '';

  // todo: valutare se è potenzialmente non sicuro ritornare al componente oggetti con USER con dentro la pwd in chiaro

  constructor(private router: Router,
              private adminService: AdminService,
              private authenticationService: AuthenticationService) {
    if (!this.authenticationService.isLoggedIn()) {
      this.authenticationService.logout();
      this.router.navigate(['/login'], );
    }
  }

  ngOnInit(): void {
    // this.adminService.getAllUsers().subscribe( res => { this.users = res; });
    // this.users$ = this.adminService.getAllUsers();
    this.adminService.getAllUsers().subscribe(
      users => {
        this.users = users as User[];
        this.error = '';
    }, error1 => {
        this.error = 'Operazione -getAllUsers- fallita';
      });
    // console.log(this.users$);
  }
}
