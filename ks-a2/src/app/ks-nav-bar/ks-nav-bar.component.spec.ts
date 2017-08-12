import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KsNavBarComponent } from './ks-nav-bar.component';

describe('KsNavBarComponent', () => {
  let component: KsNavBarComponent;
  let fixture: ComponentFixture<KsNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KsNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KsNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
