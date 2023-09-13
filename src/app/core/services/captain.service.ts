import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CaptainModel } from 'src/app/shared/models/captain.model';
import { ResponseModel } from 'src/app/shared/models/response.model';
import { API_BASE_URL } from '../constants/contant';

@Injectable({
  providedIn: 'root'
})
export class CaptainService {

  private static readonly prefix: string = `${API_BASE_URL}/captain`;

  private isLogin$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(private http:HttpClient) { }

  signIn (captain : CaptainModel): Observable<ResponseModel>{
    return this.http.post<ResponseModel>(CaptainService.prefix + '/login'  , captain)
  }

  storageToken(token : string){  
      localStorage.setItem('token', token)
      this.isLogin$$.next(true)
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn() : Observable<boolean>{
    return this.isLogin$$.asObservable()
  }
  logOut(){
    this.isLogin$$.next(false)
    return localStorage.removeItem('token')
  }

  private decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token)
  }

  getCaptainFromToken() : any{
    if(this.decodedToken())
    return {
            id : this.decodedToken().nameid,
            name : this.decodedToken().unique_name
    }
  }

}
