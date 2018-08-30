/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { BrezaTestModule } from '../../../test.module';
import { ProbaComponent } from 'app/entities/proba/proba.component';
import { ProbaService } from 'app/entities/proba/proba.service';
import { Proba } from 'app/shared/model/proba.model';

describe('Component Tests', () => {
    describe('Proba Management Component', () => {
        let comp: ProbaComponent;
        let fixture: ComponentFixture<ProbaComponent>;
        let service: ProbaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [ProbaComponent],
                providers: []
            })
                .overrideTemplate(ProbaComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProbaComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProbaService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Proba(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.probas[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
