import {Platform, Page, Alert, Modal, NavController, NavParams, ActionSheet} from 'ionic-angular';
import {UserService} from '../../services/UserService'

import {GroupEditModalPage} from '../group-edit/group-edit'
import {Group, User} from '../../components/GroupInterface';

@Page({
    templateUrl: 'build/pages/group-detail/group-detail.html'
})
export class GroupDetailPage {
    group: Group;
    users: Array<any>;
    activities: Array<any>;
    stats: any;
    groupReady: boolean = false;
    activitiesRead: boolean = false;
    _userService: UserService;

    constructor(public platform: Platform, private nav: NavController, navParams: NavParams,
        _userService: UserService) {
        // If we navigated to this page, we will have an item available as a nav param
        this.group = navParams.get('group');
        this._userService = _userService;
        console.log(this.group);
        _userService.getGroupDetail(this.group._id)
            .subscribe(res => {
                this.group.updateDataByJson(res.data);
                this.calculateSpending();
            });

        _userService.getActivityList(this.group._id)
            .subscribe(
            res => {
                this.group.updateActivitiesByJson(res.data);
                this.calculateSpending();
            }
            )

    }

    showGroupEditModal() {
        let myModal = Modal.create(GroupEditModalPage, { group: this.group });
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
        this.group.updateBalance();

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
                        console.log('go back');
                    }
                }
            ]
        });
        this.nav.present(alert);
    }
}
