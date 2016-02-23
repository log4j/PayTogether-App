import {Platform, Page, Modal, NavController, NavParams, ActionSheet} from 'ionic-framework/ionic';
import {UserService} from '../../services/UserService'

import {GroupEditModalPage} from '../group-edit/group-edit'


@Page({
    templateUrl: 'build/pages/group-detail/group-detail.html'
})
export class GroupDetailPage {
    group: any;
    users: Array<any>;
    activities: Array<any>;
    stats: any;
    groupReady: boolean = false;
    activitiesRead: boolean = false;

    constructor(public platform: Platform, private nav: NavController, navParams: NavParams,
        private _userService: UserService) {
        // If we navigated to this page, we will have an item available as a nav param
        this.group = navParams.get('item');
        console.log('from params', this.group);
        _userService.getGroupDetail(this.group._id)
            .subscribe(
            res => {
                console.log(res);
                this.users = res.data.users;
                this.group = res.data;
                this.groupReady = true;
                this.calculateSpending();
            }
            )

        _userService.getActivityList(this.group._id)
            .subscribe(
            res => {
                console.log(res);
                this.activities = res.data;
                this.activitiesRead = true;
                this.calculateSpending();
            }
            )

    }

    showGroupEditModal() {
        let myModal = Modal.create(GroupEditModalPage,{group:this.group});
        this.nav.present(myModal);
    }

    presentActionSheet(event, user) {

        let buttonHandler = (event) => {

        }

        if (this.platform.is('android')) {
            var androidSheet = {
                title: 'Create Activity',
                buttons: [
                    {
                        text: 'Paid By ' + user.displayName,
                        handler: buttonHandler,
                        icon: 'share'
                    },
                    {
                        text: 'Transfer to ' + user.displayName,
                        handler: buttonHandler,
                        icon: 'arrow-dropright-circle'
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        icon: 'md-close',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            };
        }


        let actionSheet = ActionSheet.create(androidSheet || {
            title: 'Create Activity',
            buttons: [
                {
                    text: 'Paid By ' + user.displayName,
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Transfer to ' + user.displayName,
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Cancel',
                    style: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.nav.present(actionSheet);
    }


    calculateSpending() {
        // console.log($scope.group);
        // console.log($scope.activities);
        if (!this.groupReady)
            return;
        if (!this.activitiesRead)
            return;
        
        //build user map and initialize value
        let userMap = {};
        this.group.totalSpent = 0;
        for (let i = 0; i < this.group.users.length; i++) {
            this.group.users[i].totalPaid = 0;
            this.group.users[i].totalSpent = 0;
            this.group.users[i].totalReceived = 0;
            this.group.users[i].activityHistory = [];
            userMap[this.group.users[i]._id] = this.group.users[i];
        }


        for (let i = 0; i < this.activities.length; i++) {
            let act = this.activities[i];
            
            //who paid
            userMap[act.from._id].totalPaid += act.amount;
            //who spent
            for (let j = 0; j < act.to.length; j++) {
                if (act.is_pay)
                    userMap[act.to[j].user._id].totalSpent += act.to[j].final;
                else
                    userMap[act.to[j].user._id].totalReceived += act.to[j].final;
            }
            //total amount
            if (act.is_pay)
                this.group.totalSpent += act.amount;
            //else
            
            
            
            //if this is transfer, add 0 to others
            if (!act.is_pay) {
                for (var k = 0; k < this.group.users.length; k++) {
                    if (this.group.users[k]._id == act.to[0].user._id)
                        this.group.users[k].activityHistory.push(act.to[0].final);
                    else
                        this.group.users[k].activityHistory.push(0);
                }
            } else {
                for (var j = 0; j < act.to.length; j++) {
                    userMap[act.to[j].user._id].activityHistory.push(act.to[j].final);
                }
            }


        }
        
        /**
         * in case when try to calculate the rate and divide by zero, make it 0.0001
         * it won't effect the total value since we just display $0.00 
         * */
        if (this.group.totalSpent == 0)
            this.group.totalSpent = 0.0001;
        
        // console.log($scope.group);
        // console.log($scope.activities);
        
        //build activity stats data
        var stats = {
            title: ['What for'],
            data: []
        };

        for (let i = 0; i < this.activities.length; i++) {
            stats.data.push({
                from: this.activities[i].from.displayName,
                amount: this.activities[i].amount,
                name: this.activities[i].name,
                type: this.activities[i].is_pay ? 'Pay' : 'Transfer',
                is_pay: this.activities[i].is_pay,
                date: this.activities[i].date,
                data: []
            });
        }

        for (var i = 0; i < this.group.users.length; i++) {
            var user = this.group.users[i];

            stats.title.push(user.displayName);


            for (var j = 0; j < this.activities.length; j++) {
                stats.data[j].data.push(user.activityHistory[j]); 
                //stats.data[j].data.push($filter('currency')(user.activityHistory[j], '$', 2));   
            }
        }

        stats.title.push('Amount');
        stats.title.push('Paid By');

        console.log(stats);

        this.stats = stats;

        console.log(this.users);

    }
}
