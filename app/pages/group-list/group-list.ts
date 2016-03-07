import {IonicApp, Page, Modal, NavController, NavParams} from 'ionic-angular';

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
    private app:IonicApp,
    _userService: UserService) {
        
        
        //try to get group list
        _userService.getGroups()
            .subscribe(
            data => {
                //this.groups = data.data;
                this.groups = data;
                // for(let i=0;i<data.length;i++){
                //     this.groups.push(data[i]);
                // }
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

        setTimeout(() => {
            refresher.complete();
        }, 5000);
    }

    doStart(refresher) {
    }

    doPulling(refresher) {
    }
    
    showGroupNewModal() {
        let myModal = Modal.create(GroupEditModalPage,{});
        myModal.onDismiss((data:Group)=>{
            if(data){
                this.groups.unshift(data);
                this.app.getComponent('group-list').scrollTo(0,0,400);
            }
        });
        this.nav.present(myModal);
    }
}
