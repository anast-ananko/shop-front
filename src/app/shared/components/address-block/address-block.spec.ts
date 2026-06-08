import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBlock } from './address-block';

describe('AddressBlock', () => {
  let component: AddressBlock;
  let fixture: ComponentFixture<AddressBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
