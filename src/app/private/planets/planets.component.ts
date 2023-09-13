import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject, filter, finalize, switchMap, take } from 'rxjs';
import { PlanetService } from 'src/app/core/services/planet.service';
import { PlanetModel } from 'src/app/shared/models/planet.model';
import { PlanetDialogComponent } from './planet-dialog/planet-dialog.component';
import { isEmpty } from 'src/app/core/helpers/object.util';
import { CaptainService } from 'src/app/core/services/captain.service';
import { CaptainModel } from 'src/app/shared/models/captain.model';
import { RobotModel } from 'src/app/shared/models/robot.model';
import { RobotService } from 'src/app/core/services/robot.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.scss']
})
export class PlanetsComponent implements OnInit{

  planets$$: BehaviorSubject<PlanetModel[]> = new BehaviorSubject<PlanetModel[]>([]);
  planets$: Observable<PlanetModel[]> = this.planets$$.asObservable();
  currentCaptain : CaptainModel;
  captainRobots$ : BehaviorSubject<RobotModel[]> = new BehaviorSubject<RobotModel[]>([]);


  loading: boolean = true
  
  constructor(
    private planetService : PlanetService,
    private captainService: CaptainService,
    private robotService: RobotService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ){}
  
  ngOnInit(): void {
    this.setupPlanetsListing()
    this.checkLogin()
  }

  checkLogin() {
    this.captainService.isLoggedIn().subscribe(
      islogin => {
        if(islogin === true){
          this.getCaptainRobots()
        }
      }
    )
  }

  private getCaptainRobots(){
    this.currentCaptain = this.captainService.getCaptainFromToken()
    this.robotService.getRobots(this.currentCaptain.id!).subscribe(
      captainRobots => this.captainRobots$.next(captainRobots)
    )
  }

  private setupPlanetsListing() {
    this.planetService.getPlanets()
    .subscribe(
      planets => {
        this.loading = false
        planets.forEach(
          planet => {
              planet.robotsName = planet.robots.map(robot => ' ' + robot.name)
          }
        )
        this.planets$$.next(planets)
      } 
    )
  }

  updatePlanet(planet: PlanetModel, planetId: string, index: number) {
    planet.id = planetId
    const title = 'Edit ' + planet.name 
  
    if(isEmpty(this.captainService.getCaptainFromToken())){      
      return
    }
    
    const captainRobots = this.captainRobots$.getValue()    
    
    this.openPlanetDialog(title, planet, captainRobots, this.currentCaptain).pipe(
      switchMap(editedPlanet => this.planetService.editPlanet(editedPlanet)),
    ).subscribe(editedPlanet => {    
        this.updatePlanetList(editedPlanet, index)  
      }
    )
  }

  private updatePlanetList(editedPlanet : PlanetModel, index :number){
    const planets = this.planets$$.getValue();
    editedPlanet.robotsName = editedPlanet.robots.map(robot => ' ' + robot.name)
    this.planets$$.next([...planets.slice(0, index), editedPlanet, ...planets.slice(index + 1)]);
    this.snackBar.open('Planet edited');
  }

  private openPlanetDialog(title: string, planet: PlanetModel, captainRobots : RobotModel[], currentCaptain : CaptainModel) {        
    return this.dialog.open(PlanetDialogComponent, {
      width: '400px',
      autoFocus: false,
      data: {title, planet, captainRobots, currentCaptain},
    })
      .afterClosed()
      .pipe(
        take(1),
        filter(data => !isEmpty(data)),
      )
  }
}
