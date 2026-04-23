import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

    ngOnInit() {
    console.log("Profile loaded");
  }
  

  //  This will come from API later
  user = {
  name: 'Priya Sharma',
  email: 'priya.sharma@email.com',
  phone: '+91 98765 43210',

  nominee: {
    name: 'Ramesh Sharma',
    relation: 'Father'
  },

  account: {
    memberSince: 'January 2020',
    type: 'Premium',
    kyc: 'Verified',
    linkedAccounts: 3
  }
};

editProfileImage() {
  console.log("Edit profile image clicked");

  // Later:
  // open file picker / upload image / call API
}

saveChanges() {
  console.log("Saving user data:", this.user);

  
  
 
}
}