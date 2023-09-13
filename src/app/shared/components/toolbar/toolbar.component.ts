import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { CaptainService } from 'src/app/core/services/captain.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  title = 'XPAND';
  isLogIn$ : Observable<boolean>

  constructor(
    private captainService : CaptainService,
    private dialog : MatDialog,
  ){}
  

  ngOnInit(){
    this.isLogIn$ = this.captainService.isLoggedIn()
  }
  logout(){
    this.captainService.logOut()
  }

  login() {
    return this.dialog.open(LoginComponent, {
      width : "400px",
    }).afterClosed()
  }
}
