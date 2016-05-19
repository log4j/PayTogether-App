import {Page, Alert, NavController} from 'ionic-angular';
import {UserService} from '../../services/UserService'
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
    private nav: NavController) {
        
        this._userService = _userService;
        this.loginData =
            {
                username: 'test@test.com',
                password: '123'
            }
    }

    submitLogin(event) {


        this._userService.postLogin(this.loginData.username, this.loginData.password)
            .subscribe(
            data => {
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
            err => {},
            () => {}
            );

    }
}
