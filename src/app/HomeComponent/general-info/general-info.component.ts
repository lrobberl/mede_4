import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';

export interface DialogData {
  mail: 'prova1';
  number: 'prova2';
}

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.css']
})
export class GeneralInfoComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  openDialog() {
    this.dialog.open(DialogDataInfoDialog, {
      data: {
        mail: 'admin@gmail.com',
        number: '1234567899'
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-data-info-dialog',
  templateUrl: 'dialog-data-info-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogDataInfoDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
