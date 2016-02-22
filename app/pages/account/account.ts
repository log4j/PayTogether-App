import {Component} from 'angular2/core';
import {Page} from 'ionic-framework/ionic';
import {UserService} from '../../services/UserService'



@Page({
  templateUrl: 'build/pages/account/account.html',
  providers : [UserService]
})
export class AccountPage {
    loginData: any;
    selectedItem: any;
    
  constructor(private _userService:UserService) {
      this.loginData = 
      {
          username: 'asdf',
          password: ''
      }
  }
  
  submitLogin(event){
      console.log('try to login',event,this.loginData);
      
     this._userService.postLogin(this.loginData.username,this.loginData.password)
     .subscribe(
        data => console.log(data),
    //    err => this.logError(err),
       () => console.log('Random Quote Complete')
    );
     
  }
}
