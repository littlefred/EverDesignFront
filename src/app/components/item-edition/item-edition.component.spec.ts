import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditionComponent } from './item-edition.component';

describe('ItemEditionComponent', () => {
  let component: ItemEditionComponent;
  let fixture: ComponentFixture<ItemEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
