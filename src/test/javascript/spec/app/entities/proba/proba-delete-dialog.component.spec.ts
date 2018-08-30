/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { BrezaTestModule } from '../../../test.module';
import { ProbaDeleteDialogComponent } from 'app/entities/proba/proba-delete-dialog.component';
import { ProbaService } from 'app/entities/proba/proba.service';

describe('Component Tests', () => {
    describe('Proba Management Delete Component', () => {
        let comp: ProbaDeleteDialogComponent;
        let fixture: ComponentFixture<ProbaDeleteDialogComponent>;
        let service: ProbaService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [BrezaTestModule],
                declarations: [ProbaDeleteDialogComponent]
            })
                .overrideTemplate(ProbaDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProbaDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProbaService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it(
                'Should call delete service on confirmDelete',
                inject(
                    [],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });
});
