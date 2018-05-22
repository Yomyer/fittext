import { FittextDirective } from './directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FittextDirective],
  exports: [FittextDirective]
})
export class FittextModule { }
