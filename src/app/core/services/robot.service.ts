import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RobotModel } from 'src/app/shared/models/robot.model';
import { API_BASE_URL } from '../constants/contant';

@Injectable({
  providedIn: 'root'
})
export class RobotService {

  private static readonly prefix: string = `${API_BASE_URL}/robots`;

  constructor(private http:HttpClient) { }

  getRobots(captainId : string):Observable<RobotModel[]>{
    return this.http.get<RobotModel[]>(RobotService.prefix, {
      params : {
        captainId : captainId
      }
    })
  }

}
