import { NgModule } from '@angular/core';
import { PrivateComponent } from './private.component';
import { SharedModule } from '../shared/shared.module';
import { PlanetsComponent } from './planets/planets.component';
import { PrivateRoutingModule } from './private-routing.module';
import { CommonModule } from '@angular/common';
import { PlanetDialogComponent } from './planets/planet-dialog/planet-dialog.component';

@NgModule({
  declarations: [
    PrivateComponent,
    PlanetsComponent,
    PlanetDialogComponent,
  ],
  imports: [
    PrivateRoutingModule,
    SharedModule,
    CommonModule,
  ],
  providers: [],
})
export class PrivateModule { }
