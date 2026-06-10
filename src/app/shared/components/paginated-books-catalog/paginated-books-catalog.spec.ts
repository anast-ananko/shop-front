import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatedBooksCatalog } from './paginated-books-catalog';

describe('PaginatedBooksCatalog', () => {
  let component: PaginatedBooksCatalog;
  let fixture: ComponentFixture<PaginatedBooksCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginatedBooksCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatedBooksCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
