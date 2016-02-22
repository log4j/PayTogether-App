import {Page, NavController, NavParams} from 'ionic-framework/ionic';

import {UserService} from '../../services/UserService'
import {GroupDetailPage} from '../group-detail/group-detail'

@Page({
    templateUrl: 'build/pages/group-list/group-list.html'
})
export class GroupListPage {
    selectedItem: any;
    icons: string[];
    items: Array<{ title: string, note: string, icon: string }>;
    groups: Array<any>;

    constructor(private nav: NavController, navParams: NavParams, _userService: UserService) {
        
        
        //try to get group list
        _userService.getGroups()
            .subscribe(
            data => {
                this.groups = data.data;
            })
        
        
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');

        this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
            'american-football', 'boat', 'bluetooth', 'build'];

        this.items = [];
        for (let i = 1; i < 11; i++) {
            this.items.push({
                title: 'Item ' + i,
                note: 'This is item #' + i,
                icon: this.icons[Math.floor(Math.random() * this.icons.length)]
            });
        }
    }

    itemTapped(event, item) {
        this.nav.push(GroupListPage, {
            item: item
        });
    }
    
    chooseGroup(event, item) {
        this.nav.push(GroupDetailPage, {
            item: item
        })
    }

    doRefresh(refresher) {
        console.log('Doing Refresh', refresher)

        setTimeout(() => {
            refresher.complete();
            console.log("Complete");
        }, 5000);
    }

    doStart(refresher) {
        console.log('Doing Start', refresher);
    }

    doPulling(refresher) {
        console.log('Pulling', refresher);
    }
}
