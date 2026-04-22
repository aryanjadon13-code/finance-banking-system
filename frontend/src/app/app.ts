import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from './layout/header/header';
import { Dashboard } from './dashboard/dashboard';


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet,],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  
}
