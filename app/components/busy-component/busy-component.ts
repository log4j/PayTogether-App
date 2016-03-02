import {Injectable, Component, Input, EventEmitter} from 'angular2/core';
import {Subject} from 'rxjs/Subject';

import {IONIC_DIRECTIVES} from 'ionic-angular';

@Injectable()
export class BusyCtrl {
    subject = new Subject()
    constructor() { }

    subscribe(callback) {
        return this.subject.subscribe(callback)
    }

    next(value) {
        this.subject.next(value)
    }
}

@Component({
    selector: 'busyComponent',
    templateUrl: 'build/components/busy-component/busy-component.html',
    directives: [IONIC_DIRECTIVES] // makes all Ionic directives available to your component
})
export class BusyComponent {
    d = {
        title: 'Procesando',
        subTitle: '',
        message: '<i class="fa fa-refresh fa-spin fa-3x"></i>'
    }
    isBusy = false
    constructor(
        private busyCtrl: BusyCtrl
    ) {
        // this.busyCtrl = busyCtrl
        this.busyCtrl.subscribe((showIt) => {
            this.isBusy = showIt
        })
    }

    close() {
        this.isBusy = false
    }
}