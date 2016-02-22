import {Page, NavController, NavParams, ActionSheet} from 'ionic-framework/ionic';
import {UserService} from '../../services/UserService'

@Page({
    templateUrl: 'build/pages/group-detail/group-detail.html'
})
export class GroupDetailPage {
    group: any;
    users: Array<any>;
    activities: Array<any>;

    constructor(private nav: NavController, navParams: NavParams,
        private _userService: UserService) {
        // If we navigated to this page, we will have an item available as a nav param
        this.group = navParams.get('item');
        //        console.log(this.group);
        _userService.getGroupDetail(this.group._id)
            .subscribe(
            res => {
                console.log(res);
                this.users = res.data.users;
            }
            )

        _userService.getActivityList(this.group._id)
            .subscribe(
            res => {
                console.log(res);
                this.activities = res.data;
            }
            )

    }



    presentActionSheet(event, user) {
        let actionSheet = ActionSheet.create({
            title: 'Create Activity',
            buttons: [
                {
                    text: 'Paid By '+user.displayName,
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Transfer to '+user.displayName,
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
}
