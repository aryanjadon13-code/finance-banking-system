import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
    standalone: true,

  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(public sidebarService: SidebarService , private router:Router) {}
 isOpen=false;
 toggleSidebar() {
   this.isOpen = !this.isOpen;
 }
 
  logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}
}