import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.css']
})
export class AuthButtonComponent implements OnInit {
  
  storage: Storage = localStorage;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(
      user => {
        if (user) {
          this.storage.setItem("userEmail", user.email as string);
          this.storage.setItem("userName", user.name as string);
        } else {
          this.storage.removeItem("userEmail");
          this.storage.removeItem("userName");
        }
      }
    )
  }
}
