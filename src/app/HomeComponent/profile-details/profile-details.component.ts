import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {DialogData, DialogDataInfoDialog} from '../general-info/general-info.component';
import {UserService} from '../../Services/pedibus.user.service';
import {AuthenticationService} from '../../Services/authentication.service';
import {User} from '../../Models/User';
import {Bambino} from '../../Models/Bambino';

export interface DialogData {
  dialogUser: User;
  dialogFigli: Bambino[];
}

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  currentUser: User;
  error: string;
  figli: Bambino[] = [];

  constructor(public dialog: MatDialog, private userService: UserService, private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.userService.getFigli().subscribe(
      x => {
        this.figli = x;
        this.error = undefined;
      },
      error1 => {
        this.error = 'Operazione Fallita';
      }
    );
  }

  openDialog() {
    this.dialog.open(DialogDataUserDialog, {
      data: {
        dialogUser: this.currentUser,
        dialogFigli: this.figli
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-data-user-dialog',
  templateUrl: 'dialog-data-user-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogDataUserDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
