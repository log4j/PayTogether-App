import {App, Alert, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {NgFor, NgClass, PercentPipe, CurrencyPipe, DatePipe} from 'angular2/common';
// import * as helpers from '../../../directives/helpers';
import {Group, Activity, Share} from '../../components/GroupInterface';
import {User} from '../../components/GroupInterface';
import {UserService} from '../../services/UserService'

@Page({
    templateUrl: './build/pages/activity-pay/activity-pay.html',
    directives: [NgFor, NgClass],
    providers: [PercentPipe, CurrencyPipe, DatePipe]

})
export class ActivityPayModalPage {
    platform: any;
    viewCtrl: any;
    params: any;
    currentPlatform: string;
    character: any;
    group: Group;
    fromUser: User;
    activity: Activity;
    _userService: UserService;
    user: User;
    alertOptions: any;
    percentageRemaining: number = 100;
    amountRemaining: number = 0;
    selectedIds = [];

    constructor(
        platform: Platform,
        params: NavParams,
        viewCtrl: ViewController,
        private nav: NavController,
        _userService: UserService,
        private percentPipe: PercentPipe,
        private currencyPipe: CurrencyPipe,
        private datePipe: DatePipe
    ) {
        this.viewCtrl = viewCtrl;
        this.params = params;
        this._userService = _userService;
        if (platform.is('android')) {
            this.currentPlatform = 'android';
        } else {
            this.currentPlatform = 'ios';
        }

        this.group = params.get('group');

        let activity = params.get('activity');
        
        if (activity) {
            this.activity = activity;
            //the activity.from may be different object than this.group.users
            for(let i=0;i<this.group.users.length;i++)
                if(this.group.users[i]._id==this.activity.from._id){
                    this.activity.from = this.group.users[i];
                    break;
                }
        } else {
            this.fromUser = params.get('fromUser');
            this.activity = new Activity(null);
            this.activity.isPay = true;
            this.activity.from = this.fromUser;
            this.activity.sharedByPercentage = true;
            this.activity.group = this.group;
            this.activity.date = new Date();
            this.activity.dateStr = "1990-12-22";//datePipe.transform(this.activity.date,['yyyy-MM-dd']);
            console.log(this.activity);
            console.log('asdfsdf');
            console.log(datePipe.transform(this.activity.date,['y-MM-dd']));
            this.activity.initialToByUsers(this.group.users);
        }

        this.initSelectedIds();
        this.calculateRemaining();
        this.user = _userService.user;

    }

    log() {
    }

    initSelectedIds() {
        this.selectedIds = [];
        for (let i = 0; i < this.activity.to.length; i++)
            if (this.activity.to[i].selected)
                this.selectedIds.push(this.activity.to[i].user._id);
    }

    selectMembers() {
        let tempMap = {};
        for (let i = 0; i < this.selectedIds.length; i++)
            tempMap[this.selectedIds[i]] = true;
        for (let i = 0; i < this.activity.to.length; i++)
            if (tempMap[this.activity.to[i].user._id])
                this.activity.to[i].selected = true;
            else
                this.activity.to[i].selected = false;

    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    removeMember(user: User, index: number) {
        this.group.removeMember(index);
    }



    promptForSharedValue(item) {
        let previousValue = this.activity.sharedByPercentage ? item.percentage : item.amount;
        if (previousValue == 0)
            previousValue = '';
        let prompt = Alert.create({
            title: 'How much this member shared',
            message: (this.activity.sharedByPercentage ?
                this.percentPipe.transform(this.percentageRemaining / 100, ['.2-2'])
                : this.currencyPipe.transform(this.amountRemaining + item.amount, ['USD', '2.2-2']))
                + " remaining",
            inputs: [
                {
                    name: 'value',
                    value: previousValue,
                    placeholder: 'Percentage'
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
                        if (this.activity.sharedByPercentage) {
                            item.percentage = parseFloat(parseFloat(data.value).toFixed(2));
                            item.final = this.activity.amount ? parseFloat((this.activity.amount * item.percentage / 100).toFixed(2)) : 0;
                        } else {
                            item.amount = parseFloat(parseFloat(data.value).toFixed(2));
                            item.final = item.amount;
                        }
                        this.calculateRemaining();
                    }
                }
            ]
        });
        this.nav.present(prompt);
    }

    submitActivity(form) {
        
        //do some validate
        if (!form.valid){
            let alert = Alert.create({
                title: 'Form invalid',
                subTitle: 'Please fill all required information.',
                buttons: ['OK']
            });
            this.nav.present(alert);

            return;
        }


        let error: string = null;
        
        
        if (parseFloat(form.value.amount) <= 0) {
            error = 'AMOUNT_INVALID';
            let alert = Alert.create({
                title: 'Form invalid',
                subTitle: 'Amount is not valid.',
                buttons: ['OK']
            });
            this.nav.present(alert);

            return;
        }
        if ((this.activity.sharedByPercentage && this.percentageRemaining.toFixed(2) != '0.00')
        || (!this.activity.sharedByPercentage && this.amountRemaining.toFixed(2) != '0.00')){
            let alert = Alert.create({
                title: 'Form invalid',
                subTitle: 'Remaining is not zero. Remaining:'+(this.activity.sharedByPercentage ?
                this.percentPipe.transform(this.percentageRemaining / 100, ['.2-2'])
                : this.currencyPipe.transform(this.amountRemaining, ['USD', '2.2-2'])),
                buttons: ['OK']
            });
            this.nav.present(alert);

            return;
        }

        this.activity.amount = parseFloat(this.activity.amount+'');

        this._userService.createOrUpdateActivity(this.activity)
            .subscribe((res) => {
                if (res.result) {
                    
                    let isEdit:boolean = this.activity._id?true:false;
                    this.activity._id = res.data._id;
                    this.viewCtrl.dismiss(this.activity,isEdit);
                } else {

                }
            });
    }
    
    /**
     * calculate the percentage remaining and amount remaining
     */
    calculateRemaining() {
        let totalPercentage = 0;
        let totalAmount = 0;
        for (let i = 0; i < this.activity.to.length; i++) {
            if(this.activity.to[i].selected){
                totalPercentage += this.activity.to[i].percentage;
                totalAmount += this.activity.to[i].amount;
            }
        }
        this.percentageRemaining = 100 - totalPercentage;
        this.amountRemaining = this.activity.amount ? this.activity.amount - totalAmount : 0 - totalAmount;
    }

    updateToFinalValues() {
        for (let i = 0; i < this.activity.to.length; i++) {
            let item = this.activity.to[i];
            if (this.activity.sharedByPercentage) {
                item.final = this.activity.amount ? parseFloat((this.activity.amount * item.percentage / 100).toFixed(2)) : 0;
            } else {
                item.final = parseFloat(item.amount+'');
            }
        }
        this.calculateRemaining();
    }

    setToAverage() {
        this.activity.setAverage();
        this.updateToFinalValues();
    }

    updateDate() {


        this.activity.date = new Date(this.activity.dateStr);
        console.log(this.activity);
        //this.activity.date = new Date(this.activity.date);
    }
    
    
}