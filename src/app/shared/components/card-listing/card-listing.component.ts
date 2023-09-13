import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlanetModel } from '../../models/planet.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-listing',
  templateUrl: './card-listing.component.html',
  styleUrls: ['./card-listing.component.scss']
})
export class CardListingComponent {
  @Input()
  planet : PlanetModel

  @Output()
  planetClickit: EventEmitter<PlanetModel> = new EventEmitter<PlanetModel>();

  getClassOf(status: string) {
    if (status == 'OK')
      return 'ok'
    else if (status =='!OK')
      return 'not-ok'
    else if (status == 'TO DO')
      return 'to-do'
    else return 'en-route'
  }

  onRowClick(){
    const planetSubmit : PlanetModel = {
      name: this.planet.name,
      status : this.planet.status,
      description : this.planet.description,
      robots: this.planet.robots,
      robotsName: this.planet.robotsName,
      image: this.planet.image,
      lastCaptainUpdate: this.planet.lastCaptainUpdate

    }
      this.planetClickit.emit(planetSubmit)   
  }
}
