import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Bambino} from '../../Models/Bambino';
import {UserService} from '../../Services/pedibus.user.service';

export interface Child {
  name: string;
}

/** @title Select with form field features */
@Component({
  selector: 'app-select-children',
  templateUrl: './select-children.component.html',
  styleUrls: ['./select-children.component.css']
})
export class SelectChildrenComponent {
  selected: 'Children selected';
  error: string;
  childrenControl = new FormControl('', [Validators.required]);
  bambini: Bambino[] = [];

  children: Child[] = [
    {name: 'Mario'},
    {name: 'Luigi'},
    {name: 'Marco'},
    {name: 'Riccardo'},
  ];


}
