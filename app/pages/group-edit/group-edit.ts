import {App, Alert, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {NgFor} from 'angular2/common';
// import * as helpers from '../../../directives/helpers';
import {Group} from '../../components/GroupInterface';

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
    group: Group;

    constructor(
        platform: Platform,
        params: NavParams,
        viewCtrl: ViewController,
        private nav: NavController
    ) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        if (platform.is('android')) {
            this.currentPlatform = 'android';
        } else {
            this.currentPlatform = 'ios';
        }

        // this.group = params.get('group');
        // console.log(this.group);
        
        this.group = new Group();
        
        this.group.name = 'hahaha';
        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


    promptForName() {
        let prompt = Alert.create({
            title: 'New Member',
            message: "Enter the member's email or username, or a simple tag",
            inputs: [
                {
                    name: 'Name',
                    placeholder: 'Name'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                    }
                }
            ]
        });
        this.nav.present(prompt);
    }
}