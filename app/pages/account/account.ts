import {Component} from 'angular2/core';
import {Page, Alert, NavController} from 'ionic-angular';
import {UserService} from '../../services/UserService'
import {BusyCtrl} from '../../components/busy-component/busy-component';
import {GroupListPage} from '../group-list/group-list';



@Page({
    templateUrl: 'build/pages/account/account.html'
    // providers: [UserService]
})
export class AccountPage {
    loginData: any;
    selectedItem: any;
    _userService: UserService;
    
    constructor( _userService: UserService, 
    private nav: NavController, 
    private busyCtrl: BusyCtrl) {
        
        console.log('in account page');
        this._userService = _userService;
        this.loginData =
            {
                username: 'yangmang',
                password: '123'
            }
    }

    submitLogin(event) {
        console.log('try to login', event, this.loginData);

        this.busyCtrl.next(true);

        this._userService.postLogin(this.loginData.username, this.loginData.password)
            .subscribe(
            data => {
                console.log(data)
                if (data.result) {

                    this._userService.updateProfile(data.data);

                    this.nav.setRoot(GroupListPage, { userId: data.data._id });
                } else {
                    let alert = Alert.create({
                        title: 'Login Failed',
                        subTitle: 'Please review your username and password!',
                        buttons: ['Ok']
                    });
                    this.nav.present(alert);
                }
            },
            err => console.log(err),
            () => console.log('Random Quote Complete')
            );

    }
}
