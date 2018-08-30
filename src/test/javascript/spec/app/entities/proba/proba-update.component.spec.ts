/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { BrezaTestModule } from '../../../test.module';
import { ProbaUpdateComponent } from 'app/entities/proba/proba-update.component';
import { ProbaService } from 'app/entities/proba/proba.service';
import { Proba } from 'app/shared/model/proba.model';

describe('Component Tests', () => {
    describe('Proba Management Update Component', () => {
        let comp: ProbaUpdateComponent;
        let fixture: ComponentFixture<ProbaUpdateComponent>;
        let service: ProbaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [ProbaUpdateComponent]
            })
                .overrideTemplate(ProbaUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProbaUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProbaService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Proba(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.proba = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Proba();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.proba = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
