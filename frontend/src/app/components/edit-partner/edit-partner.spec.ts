import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartner } from './edit-partner';

describe('EditPartner', () => {
  let component: EditPartner;
  let fixture: ComponentFixture<EditPartner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPartner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPartner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
