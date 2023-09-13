import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanetModel } from 'src/app/shared/models/planet.model';
import { API_BASE_URL } from '../constants/contant';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {

  private static readonly prefix: string = `${API_BASE_URL}/planets`;

  constructor(private http:HttpClient) { }

  getPlanets():Observable<PlanetModel[]>{
    return this.http.get<PlanetModel[]>(PlanetService.prefix)
  }

  getPlanetById(idPlanet:string):Observable<PlanetModel>{
    return this.http.get<PlanetModel>(`${PlanetService.prefix}/${idPlanet}`)
  }

  editPlanet(planet : PlanetModel) : Observable<PlanetModel>{
    return this.http.put<PlanetModel>(`${PlanetService.prefix}/${planet.id}`, planet)
  }

}
