import {Platform, Page, Alert, Modal, NavController, NavParams, ActionSheet} from 'ionic-angular';
import {UserService} from '../../services/UserService'
import {NgFor, NgClass, PercentPipe, CurrencyPipe} from '@angular/common';
import {GroupEditModalPage} from '../group-edit/group-edit'
import {ActivityPayModalPage} from '../activity-pay/activity-pay'
import {ActivityTransferModalPage} from '../activity-transfer/activity-transfer'
import {Group, User, Activity} from '../../components/GroupInterface';

@Page({
    templateUrl: 'build/pages/group-detail/group-detail.html',
    providers: [PercentPipe, CurrencyPipe]
})
export class GroupDetailPage {
    group: Group;
    users: Array<any>;
    activities: Array<any>;
    stats: any;
    groupReady: boolean = false;
    activitiesRead: boolean = false;
    _userService: UserService;

    constructor(public platform: Platform,
        private nav: NavController,
        navParams: NavParams,
        private currencyPipe: CurrencyPipe,
        _userService: UserService) {
        // If we navigated to this page, we will have an item available as a nav param
        this.group = navParams.get('group');
        this._userService = _userService;
        _userService.getGroupDetail(this.group._id)
            .subscribe(res => {
                this.group.updateDataByJson(res.data);
                this.calculateSpending();
                console.log('data',this.group);
            });

        _userService.getActivityList(this.group._id)
            .subscribe(
            res => {
                this.group.updateActivitiesByJson(res.data);
                this.calculateSpending();
                console.log('activity',this.group);
            }
            )

    }

    /**
     * popup group edit modal
     */
    showGroupEditModal() {
        let myModal = Modal.create(GroupEditModalPage, { group: this.group });
        this.nav.present(myModal);
    }

    showActivityPayEditModal(activity: Activity, isPay: boolean, user: User) {

        let activityModal = Modal.create(
            isPay ? ActivityPayModalPage : ActivityTransferModalPage, {
                group: this.group,
                activity: activity,
                fromUser: user
            }
        );

        activityModal.onDismiss((data: Activity, isEdit:boolean) => {
            if (data) {
                if(!isEdit){
                    this.group.activities.unshift(data);
                }else{
                }
                this.calculateSpending();
            }
        });

        this.nav.present(activityModal);
    }
    
    


    /**
     * pop up action sheet on User
     */
    presentActionSheetOnUser(event, user) {

        if (this.platform.is('android')) {
            var androidSheet = {
                title: 'Create Activity',
                buttons: [
                    {
                        text: 'Paid By ' + user.displayName,
                        handler: event => this.showActivityPayEditModal(null, true, user),

                        icon: 'cart'
                    },
                    {
                        text: 'Transfer from ' + user.displayName,
                        handler: event => this.showActivityPayEditModal(null, false, user),
                        icon: 'cash'
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        icon: 'md-close'
                    }
                ]
            };
        }

        let actionSheet = ActionSheet.create(androidSheet || {
            title: 'Create Activity',
            buttons: [
                {
                    text: 'Paid By ' + user.displayName,
                    handler: event => this.showActivityPayEditModal(null, true, user)
                }, {
                    text: 'Transfer from ' + user.displayName,
                    handler: event => this.showActivityPayEditModal(null, false, user)
                }, {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        });
        this.nav.present(actionSheet);
    }


    presentActionSheetOnActivity(event, activity:Activity) {
        let title = activity.from.displayName + ' paid ' + this.currencyPipe.transform(activity.amount, 'USD', true, '.2-2') + ' for ' + activity.name;
        if (this.platform.is('android')) {
            var androidSheet = {
                title: title,
                buttons: [
                    {
                        text: 'Edit',
                        handler: event => this.showActivityPayEditModal(activity, activity.isPay, null),
                        icon: 'options'
                    },
                    {
                        text: 'Delete',
                        handler: event => this.deleteActivity(activity),
                        icon: 'trash'
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        icon: 'md-close'
                    }
                ]
            };
        }

        let actionSheet = ActionSheet.create(androidSheet || {
            title: title,
            buttons: [
                {
                    text: 'Edit',
                    handler: event => this.showActivityPayEditModal(activity, activity.isPay, null)
                }, {
                    text: 'Delete',
                    handler: event => this.deleteActivity(activity)
                }, {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        });
        this.nav.present(actionSheet);
    }

    calculateSpending() {
        this.group.updateBalance();
        for(let i=0;i<this.group.users.length;i++){
            if(this.group.users[i]._id == this._userService.user._id){
                this.group.userOwned = this.group.users[i].totalPaid - this.group.users[i].totalSpent - this.group.users[i].totalReceived;
            }
        }
    }

    removeGroup() {
        let alert = Alert.create({
            title: 'Delete Confirm',
            message: 'Do you want to delete this group?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Confirm',
                    handler: () => {
                        this.nav.popToRoot(
                            //{animate: true,direction:'back',duration:400}
                        );
                    }
                }
            ]
        });
        this.nav.present(alert);
    }

    deleteActivity(activity:Activity) {
        let alert = Alert.create({
            title: 'Confirm delete',
            message: 'Do you want to delete this record?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this._userService.deleteActivity(activity)
                        .subscribe(res=>{
                            if(res.result){
                                for(let i=0;i<this.group.activities.length;i++){
                                    if(this.group.activities[i]._id == activity._id){
                                        this.group.activities.splice(i,1);
                                        break;
                                    }
                                }
                                this.calculateSpending();
                            } 
                        });
                    }
                }
            ]
        });
        this.nav.present(alert);
    }
    
    currency(value){
        return this.currencyPipe.transform(parseFloat(value),'USD',true,'.2-2');
    }
}
