import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandTabMenuComponent } from './brand-tab-menu.component';

describe('BrandTabMenuComponent', () => {
  let component: BrandTabMenuComponent;
  let fixture: ComponentFixture<BrandTabMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandTabMenuComponent]
    });
    fixture = TestBed.createComponent(BrandTabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
