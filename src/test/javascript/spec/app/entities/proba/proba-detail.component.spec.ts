/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { ProbaDetailComponent } from 'app/entities/proba/proba-detail.component';
import { Proba } from 'app/shared/model/proba.model';

describe('Component Tests', () => {
    describe('Proba Management Detail Component', () => {
        let comp: ProbaDetailComponent;
        let fixture: ComponentFixture<ProbaDetailComponent>;
        const route = ({ data: of({ proba: new Proba(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [ProbaDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProbaDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProbaDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.proba).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
