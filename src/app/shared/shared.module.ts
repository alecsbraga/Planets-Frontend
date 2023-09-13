import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CardListingComponent } from './components/card-listing/card-listing.component';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubscriptionCleanupComponent } from './components/abstract-component/subscription-cleanup.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    CardListingComponent,
    SubscriptionCleanupComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports:[
    ToolbarComponent,
    CardListingComponent,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule { }
