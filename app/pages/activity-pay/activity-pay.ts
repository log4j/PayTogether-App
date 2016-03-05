import {App, Alert, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {NgFor,NgClass,PercentPipe,CurrencyPipe} from 'angular2/common';
// import * as helpers from '../../../directives/helpers';
import {Group, Activity, Share} from '../../components/GroupInterface';
import {User} from '../../components/GroupInterface';
import {UserService} from '../../services/UserService'

@Page({
    templateUrl: './build/pages/activity-pay/activity-pay.html',
    directives: [NgFor,NgClass],
    providers: [PercentPipe,CurrencyPipe]

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
    alertOptions:any;
    percentageRemaining:number = 100;
    amountRemaining:number = 0;

    constructor(
        platform: Platform,
        params: NavParams,
        viewCtrl: ViewController,
        private nav: NavController,
        _userService: UserService,
        private percentPipe: PercentPipe,
        private currencyPipe: CurrencyPipe
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
        //console.log('user in Group edit want to fecth from _userService',_userService.user);
        
        if(activity){
            this.activity = activity;
            console.log('Group:',activity);
        }else{
            this.fromUser = params.get('fromUser');
            this.activity = new Activity(null);
            this.activity.isPay = true;
            this.activity.from = this.fromUser;
            this.activity.sharedByPercentage = true;
            this.activity.initialToByUsers(this.group.users);
            console.log(this.activity);
            //this.group.addMember(_userService.user);
            //this.group.creator = _userService.user;
            //this.group.name = '';
        }
        
        
        this.user = _userService.user;
        
    }

    log(){
        console.log(this.activity.from);    
    }
    
    dismiss() {
        this.viewCtrl.dismiss();
    }
    
    removeMember(user:User,index:number){
        this.group.removeMember(index);
    }



    promptForSharedValue(item) {
        let previousValue = this.activity.sharedByPercentage?item.percentage:item.amount;
        if(previousValue == 0)
            previousValue = '';
        let prompt = Alert.create({
            title: 'How much this member shared',
            message: this.activity.sharedByPercentage?
                this.percentPipe.transform(this.percentageRemaining/100,['.2-2'])
                : this.currencyPipe.transform(this.amountRemaining + item.amount,['USD','2.2-2'])
                +" remaining",
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
                        console.log(data.value);
                        if(this.activity.sharedByPercentage){
                            item.percentage = parseFloat(parseFloat(data.value).toFixed(2));
                            item.final = this.activity.amount? parseFloat((this.activity.amount*item.percentage/100).toFixed(2)):0;
                        }else{
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
    
    /**
     * calculate the percentage remaining and amount remaining
     */
    calculateRemaining(){
        let totalPercentage = 0;
        let totalAmount = 0;
        for(let i=0;i<this.activity.to.length;i++){
            totalPercentage += this.activity.to[i].percentage;
            totalAmount += this.activity.to[i].amount;
        }
        this.percentageRemaining = 100 - totalPercentage;
        this.amountRemaining = this.activity.amount?this.activity.amount - totalAmount: 0 - totalAmount;
    }
    
    updateToFinalValues(){
        for(let i=0;i<this.activity.to.length;i++){
            let item = this.activity.to[i];
            if(this.activity.sharedByPercentage){
                item.final = this.activity.amount? parseFloat((this.activity.amount*item.percentage/100).toFixed(2)):0;
            }else{
                item.final = item.amount;
            }
        }
        this.calculateRemaining();
    }
    
    onSubmitGroupInfo(form){
        if(form.valid){
            //submit
            console.log(form);
            
            this._userService.updateGroup(this.group)
            .subscribe(
                res => {
                    console.log(res);
                    if(res.result){
                        //submit,
                        this.viewCtrl.dismiss(new Group(res.data));
                    }else{
                        //show alert
                    }
                }
            )
            
        }
        
    }
}