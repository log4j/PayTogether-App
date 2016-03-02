import {App, Alert, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {NgFor,NgClass} from 'angular2/common';
// import * as helpers from '../../../directives/helpers';
import {Group} from '../../components/GroupInterface';
import {User} from '../../components/GroupInterface';
import {UserService} from '../../services/UserService'

@Page({
    templateUrl: './build/pages/group-edit/group-edit.html',
    directives: [NgFor,NgClass]

})
export class GroupEditModalPage {
    platform: any;
    viewCtrl: any;
    params: any;
    currentPlatform: string;
    character: any;
    group: Group;
    _userService: UserService;
    user: User;

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

        // this.group = params.get('group');
        console.log('user in Group edit want to fecth from _userService',_userService.user);
        
        this.group = new Group();
        this.group.addMember(_userService.user);
        this.user = _userService.user;
        this.group.name = '';
        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    
    removeMember(user:User,index:number){
        
        console.log(user,index);
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
                                    result = this.group.addMember(new User(data.Name));
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
        }
        
    }
}