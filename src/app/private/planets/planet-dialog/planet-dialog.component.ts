import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild, inject} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, combineLatest, map, of, startWith} from 'rxjs';
import { StatusTypes } from 'src/app/core/constants/contant';
import { SubscriptionCleanupComponent } from 'src/app/shared/components/abstract-component/subscription-cleanup.component';
import { CaptainModel } from 'src/app/shared/models/captain.model';
import { PlanetModel } from 'src/app/shared/models/planet.model';
import { RobotModel } from 'src/app/shared/models/robot.model';

@Component({
  selector: 'app-planet-dialog',
  templateUrl: './planet-dialog.component.html',
  styleUrls: ['./planet-dialog.component.scss'],

})
export class PlanetDialogComponent extends SubscriptionCleanupComponent  implements OnInit {
  pageTitle: string;

  planetForm: FormGroup;
  descriptionControl: FormControl;
  statusControl: FormControl;
  robotsControl: FormControl;
  searchRobot = new FormControl('');

  allRobots: RobotModel[]
  filteredRobots$: Observable<RobotModel[]>;
  robotsSelected$: Observable<RobotModel[]>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly statusTypes = StatusTypes

  
  @ViewChild('robotInput') fruitInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlanetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialogData: {
        title: string,
        planet: PlanetModel,
        captainRobots : RobotModel[],
        currentCaptain : CaptainModel}
  ) {
    super()
  }

  ngOnInit(): void {
    this.setupDialogForm()
  }

  submit(): void {
    if (this.planetForm.valid) {
      const payload : PlanetModel = {
        ...this.planetForm.getRawValue(),
        lastCaptainUpdate : this.dialogData.currentCaptain.name,
      };            
      this.dialogRef.close(payload);
    } else {
      this.planetForm.markAllAsTouched();
    }
  }

  private setupDialogForm() {
    const {title, planet, captainRobots} = this.dialogData;
    this.pageTitle = title; 
    this.allRobots = captainRobots;
    this.setupform(planet)
  } 

  private setupform(planet: PlanetModel){
    this.planetForm = this.fb.group({
      id: planet? planet.id : null,
      description: [planet ? planet.description : null, Validators.required],
      status: [planet ? planet.status : null, Validators.required],
      robots : [planet ? planet.robots : null]
    });

    this.descriptionControl = this.planetForm.get('description') as FormControl;
    this.statusControl = this.planetForm.get('status') as FormControl;
    this.robotsControl = this.planetForm.get('robots') as FormControl
    this.setupHandleRobotValue()

  }

  private setupHandleRobotValue(){
    this.filteredRobots$ = combineLatest([this.robotsControl.valueChanges, this.searchRobot.valueChanges])
    .pipe(
      startWith([this.robotsControl.value, null]),
      map(([robot, searchValue]) => this.filterExistingRobot(robot, searchValue)),
    );

    this.robotsSelected$ = this.robotsControl.valueChanges.pipe(
      startWith(this.robotsControl.value),
    )
  }

  add(event: MatChipInputEvent, matRobotsList: RobotModel[]): void {
    const selectRobotName = this.searchRobot.value!.toLowerCase(); 
    const findRobot = matRobotsList.find(robot => robot.name.toLowerCase().includes(selectRobotName))
    if(findRobot){
      this.robotsControl.value.push(findRobot)
      event.chipInput!.clear();
      this.searchRobot.reset()
      this.robotsControl.updateValueAndValidity()
      this.searchRobot.updateValueAndValidity()
    }

  }

  remove(robot: RobotModel, filteredRobot: RobotModel[]): void {    
    const index = this.robotsControl.value.indexOf(robot)

    if (index >= 0) {

      this.robotsControl.value.splice(index, 1);            
      filteredRobot.push(robot)
      this.robotsControl.updateValueAndValidity()
      this.searchRobot.updateValueAndValidity()
    }
    this.announcer.announce(`Removed ${robot}`);
  }

  selected(event: MatAutocompleteSelectedEvent): void {     
    const selectRobotName = event.option.viewValue.toLowerCase();    
    const findRobot = this.allRobots.find(robot => robot.name.toLowerCase().includes(selectRobotName))!
    
    const robots = this.robotsControl.value
    robots.push(findRobot)
    this.robotsControl.patchValue(robots)
    this.robotsControl.updateValueAndValidity()
    this.searchRobot.setValue(null);

  }

  private filterExistingRobot(robots : RobotModel[], searchValue: string): RobotModel[] {          
    if(searchValue != null){
      const existingRobots = this.allRobots.filter(robot => !robots.some(otherRobot => otherRobot.id === robot.id))
      return existingRobots.filter(robot => robot.name.toLowerCase().includes(searchValue!));
    }
    return this.allRobots.filter(robot => !robots.some(otherRobot => otherRobot.id === robot.id));
  }

}