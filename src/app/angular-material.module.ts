
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
@NgModule({
/*imports: [
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatPaginatorModule,
  MatDialogModule,
  MatExpansionModule,
  MatProgressSpinnerModule
],*/
//Angular provide an optimization technique by just exporting these modules they will automatically be imported...
exports: [
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatPaginatorModule,
  MatDialogModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatStepperModule,
  MatGridListModule
]
})

export class AngularMaterialModule
{

}
