import { Inject, Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { AppConfig, AppSettings } from '../appSettings';

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    {provide: AppConfig, useValue: AppSettings}
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'app';
  public categories;

  constructor(@Inject(AppSettings) appSettings: AppConfig) {
    this.categories = appSettings.categories;
  }
}
