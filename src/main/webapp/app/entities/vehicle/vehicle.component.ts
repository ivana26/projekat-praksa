import { Vehicle } from './../../shared/model/vehicle.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { IVehicle } from 'app/shared/model/vehicle.model';
import { Principal } from 'app/core';
import { VehicleService } from './vehicle.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';
import { faSave } from '@fortawesome/free-solid-svg-icons';
@Component({
    selector: 'jhi-vehicle',
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent implements OnInit, OnDestroy {
    vehicles: IVehicle[];
    currentAccount: any;
    eventSubscriber: Subscription;
    data: LocalDataSource;
    private vehiclee: IVehicle;
    isSaving: boolean;
    settings = {
        mode: 'inline',
        add: {
            confirmCreate: true
        },
        actions: {
            delete: false,
            custom: [
                {
                    name: 'View',
                    title: 'View  '
                },
                {
                    name: 'Delete',
                    title: 'Delete'
                }
            ]
        },
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false
            },
            vehicleNumber: {
                title: 'Vehicle Number'
            },
            brand: {
                title: 'Brand'
            },
            model: {
                title: 'Model'
            }
        },
        attr: {
            class: 'table table-striped table table-success'
        }
    };

    constructor(
        private vehicleService: VehicleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}

    loadAll() {
        this.vehicleService.query().subscribe(
            (res: HttpResponse<IVehicle[]>) => {
                // this.vehicles = res.body;
                this.data = new LocalDataSource(res.body);
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInVehicles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IVehicle) {
        return item.id;
    }

    registerChangeInVehicles() {
        this.eventSubscriber = this.eventManager.subscribe('vehicleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    myView(event) {
        if (event.action === 'Delete') {
            this.router.navigate(['/', { outlets: { popup: 'vehicle/' + event.data.id + '/delete' } }]);
        }
        if (event.action === 'View') {
            this.router.navigate(['vehicle/' + event.data.id + '/view']);
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVehicle>>) {
        result.subscribe((res: HttpResponse<IVehicle>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }
    previousState() {
        window.history.back();
    }

    save(vehicle: Vehicle) {
        this.isSaving = true;
        if (vehicle.id) {
            this.subscribeToSaveResponse(this.vehicleService.update(vehicle));
        } else {
            this.subscribeToSaveResponse(this.vehicleService.create(vehicle));
        }
    }

    private onSaveSuccess() {
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

    onCreateConfirm(event) {
        const vehicle: Vehicle = event.newData;
        console.log('HEJJJJ', vehicle.brand);
        if (
            vehicle.brand !== null &&
            vehicle.brand.charAt(0).toLowerCase() !== vehicle.brand.charAt(0) &&
            window.confirm('Are you sure you want to save?')
        ) {
            event.confirm.resolve(vehicle);
            this.save(vehicle);
        } else {
            event.confirm.reject();
            this.onSaveError();
        }
    }
}
