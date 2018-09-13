import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) private dataLoad: any) { this.data = dataLoad; }

  ngOnInit() {
  }

}
