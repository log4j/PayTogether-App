import {App, Alert, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {NgFor,NgClass} from 'angular2/common';
// import * as helpers from '../../../directives/helpers';
import {Group, Activity} from '../../components/GroupInterface';
import {User} from '../../components/GroupInterface';
import {UserService} from '../../services/UserService'

@Page({
    templateUrl: './build/pages/activity-pay/activity-pay.html',
    directives: [NgFor,NgClass]

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

    constructor(
        platform: Platform,
        params: NavParams,
        viewCtrl: ViewController,
        private nav: NavController,
        _userService: UserService
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
        
            this.alertOptions = {
            title: 'Pizza Toppings',
            subTitle: 'Select your toppings'
            };
        
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
                        this._userService.getUserByUsernameOrEmail(data.Name)
                        .subscribe(
                            res =>{
                                let result = false;
                                if(res!=null){
                                    result = this.group.addMember(res);
                                }else{
                                    result = this.group.addMember( User.createUserByDisplayName(data.Name));
                                }
                                if(!result){
                                    // let alert = Alert.create({
                                    //     title: 'Add Failed',
                                    //     subTitle: 'Member already in list!',
                                    //     buttons: ['Ok']
                                    // });
                                    // this.nav.present(alert);
                                }
                            }
                        )
                        
                    }
                }
            ]
        });
        this.nav.present(prompt);
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