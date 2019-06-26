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
  templateUrl: './user.list.component.html',
  styleUrls: ['./user.list.component.css']
})

export class UserListComponent implements OnInit {
  // users: User[];
  users$: Observable<User[]>;

  // todo: valutare se è potenzialmente non sicuro ritornare al componente oggetti con USER con dentro la pwd in chiaro

  constructor(private router: Router,
              private adminService: AdminService) {
  }

  ngOnInit(): void {
    // this.adminService.getAllUsers().subscribe( res => { this.users = res; });
    this.users$ = this.adminService.getAllUsers();
  }
}
