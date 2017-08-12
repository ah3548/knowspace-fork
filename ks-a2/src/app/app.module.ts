import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { KsNavBarComponent } from './ks-nav-bar/ks-nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    KsNavBarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
