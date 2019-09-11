import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {DialogData, DialogDataInfoDialog} from '../general-info/general-info.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  openDialog() {
    this.dialog.open(DialogDataNewsDialog, {
      data: {
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-data-news-dialog',
  templateUrl: 'dialog-data-news-dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogDataNewsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
