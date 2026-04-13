import { Component } from '@angular/core';

import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Sidebar,Header,RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  standalone:true
})
export class Layout {

}
