import {App, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {NgFor} from 'angular2/common';
// import * as helpers from '../../../directives/helpers';


@Page({
    templateUrl: './build/pages/group-edit/group-edit.html',
    directives: [NgFor]

})
export class GroupEditModalPage {
    platform: any;
    viewCtrl: any;
    params: any;
    currentPlatform: string;
    character: any;
    group: any;
    
    constructor(
        platform: Platform,
        params: NavParams,
        viewCtrl: ViewController
    ) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        if (platform.is('android')) {
            this.currentPlatform = 'android';
        } else {
            this.currentPlatform = 'ios';
        }

        this.group = params.get('group');
        console.log(this.group);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}