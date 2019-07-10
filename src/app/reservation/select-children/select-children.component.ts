import {Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';

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

  childrenControl = new FormControl('', [Validators.required]);
  children: Child[] = [
    {name: 'Mario'},
    {name: 'Luigi'},
    {name: 'Marco'},
    {name: 'Riccardo'},
  ];
}
