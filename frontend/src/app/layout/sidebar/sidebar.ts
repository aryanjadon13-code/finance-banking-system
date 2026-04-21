import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
    standalone: true,

  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(public sidebarService: SidebarService) {}
 isOpen=false;
 toggleSidebar() {
   this.isOpen = !this.isOpen;
 }
}