import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTabMenuComponent } from './product-tab-menu.component';

describe('ProductTabMenuComponent', () => {
  let component: ProductTabMenuComponent;
  let fixture: ComponentFixture<ProductTabMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductTabMenuComponent]
    });
    fixture = TestBed.createComponent(ProductTabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
