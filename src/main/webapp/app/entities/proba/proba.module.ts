import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrezaSharedModule } from 'app/shared';
import {
    ProbaComponent,
    ProbaDetailComponent,
    ProbaUpdateComponent,
    ProbaDeletePopupComponent,
    ProbaDeleteDialogComponent,
    probaRoute,
    probaPopupRoute
} from './';

const ENTITY_STATES = [...probaRoute, ...probaPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [ProbaComponent, ProbaDetailComponent, ProbaUpdateComponent, ProbaDeleteDialogComponent, ProbaDeletePopupComponent],
    entryComponents: [ProbaComponent, ProbaUpdateComponent, ProbaDeleteDialogComponent, ProbaDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaProbaModule {}
