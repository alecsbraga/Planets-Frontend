import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, finalize, of } from 'rxjs';
import { CaptainService } from 'src/app/core/services/captain.service';
import { CaptainModel } from '../../models/captain.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    usernameControl : FormControl
    passwordControl : FormControl
    loadingLogin : boolean
    titleLogin: string;

  constructor(    
    private fb: FormBuilder,
    private captainService : CaptainService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LoginComponent>,) { 
    }

  ngOnInit(): void {
    this.titleLogin = "Login"
    this.loadingLogin = false
    
    this.loginForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });

      this.usernameControl = this.loginForm.get('username') as FormControl;
      this.passwordControl = this.loginForm.get('password') as FormControl;
  }

  login(){
      if (this.loginForm.valid) {
        this.loadingLogin = true
        const rawValue = this.loginForm.getRawValue()
        const payload : CaptainModel = {
          username : rawValue.username,
          password : rawValue.password,
        }
        this.captainService.signIn(payload).pipe(
          catchError(
            () => {
              const response : any = {
                message : 'Something went wrong!'
              }
                return of(response)
            }
          ),
        ).subscribe(
          (respons :any) => {
            this.loadingLogin = false

            if(respons.message === "Login successfully"){
                this.captainService.storageToken(respons.token);
                this.snackBar.open(respons.message,'',{duration: 5000})
                this.dialogRef.close()
            }
             else {              
                this.snackBar.open(respons.message,'',{duration: 5000})}
            }

        )
      } else {
        this.loginForm.markAllAsTouched();
      }
  }

}