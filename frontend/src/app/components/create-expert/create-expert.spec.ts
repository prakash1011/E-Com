import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpert } from './create-expert';

describe('CreateExpert', () => {
  let component: CreateExpert;
  let fixture: ComponentFixture<CreateExpert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateExpert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateExpert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
