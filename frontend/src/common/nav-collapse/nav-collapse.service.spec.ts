import { TestBed } from '@angular/core/testing';

import { NavCollapseService } from './nav-collapse.service';

describe('NavCollapseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavCollapseService = TestBed.get(NavCollapseService);
    expect(service).toBeTruthy();
  });
});
