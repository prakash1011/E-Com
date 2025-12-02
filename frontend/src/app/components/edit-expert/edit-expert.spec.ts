import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpert } from './edit-expert';

describe('EditExpert', () => {
  let component: EditExpert;
  let fixture: ComponentFixture<EditExpert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExpert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
