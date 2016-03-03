import {Page, Modal, NavController, NavParams} from 'ionic-angular';

import {UserService} from '../../services/UserService'
import {GroupDetailPage} from '../group-detail/group-detail'

import {GroupEditModalPage} from '../group-edit/group-edit'
import {Group,User} from '../../components/GroupInterface';

@Page({
    templateUrl: 'build/pages/group-list/group-list.html'
})
export class GroupListPage {
    selectedItem: any;
    icons: string[];
    items: Array<{ title: string, note: string, icon: string }>;
    groups: Array<Group>;
    

    constructor(private nav: NavController, 
    navParams: NavParams, 
    _userService: UserService) {
        
        
        //try to get group list
        _userService.getGroups()
            .subscribe(
            data => {
                // console.log('from getGroups',data);
                //this.groups = data.data;
                this.groups = data;
                // for(let i=0;i<data.length;i++){
                //     this.groups.push(data[i]);
                // }
                console.log(data);
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
    
    chooseGroup(event, group) {
        this.nav.push(GroupDetailPage, {
            group: group
        })
    }

    doRefresh(refresher) {
        // console.log('Doing Refresh', refresher)

        setTimeout(() => {
            refresher.complete();
            // console.log("Complete");
        }, 5000);
    }

    doStart(refresher) {
        // console.log('Doing Start', refresher);
    }

    doPulling(refresher) {
        // console.log('Pulling', refresher);
    }
    
    showGroupNewModal() {
        let myModal = Modal.create(GroupEditModalPage,{});
        myModal.onDismiss((data:Group)=>{
            if(data){
                this.groups.push(data);
            }
        });
        this.nav.present(myModal);
    }
}
