import {Injectable} from 'angular2/core';
import {JsonHttp} from '../utils/JsonHttp';
import {Observable} from 'rxjs/Observable';
import {LocalStorage} from 'angular2-local-storage/local_storage';

import {User} from '../components/GroupInterface'
import {Result} from '../components/HttpResult'

@Injectable()
export class UserService {

    userId: string;
    profile: any;

    constructor(private _http: JsonHttp, private _localStorage: LocalStorage) {


    }

    postLogin(username: string, password: string) {
        //   console.log(data,this.host);
      
        return this._http.post('login', {
            username: username,
            password: password
        });
          
        // n this._http.get('group',{
        //     user: '56b14506d046d8d202d06e51'
        // });
    
        // return this._http.get(this.host+'group?user=56b14506d046d8d202d06e51')
        //.map((res:Response)=>res.json())
        //   .subscribe(
        // //    data => console.log(data),
        // //   err => this.logError(err),
        //   () => console.log('Random Quote Complete')
        // );
    }

    updateProfile(data: any) {
        this.profile = data;
        this._localStorage.setObject('profile', data);
    }

    getGroups()  {
        this.profile = this._localStorage.getObject('profile');
        return this._http.get('group', { user: this.profile._id })
        .map(res =>{
            return res.data;
        });
    }
    
    getGroupDetail(groupId) {
        return this._http.get('group/'+groupId,null);        
    }
    
    getActivityList(groupId) {
        return this._http.get('activity',{
            group:groupId
        });
    }
    
    getUserByUsernameOrEmail(username:string) :Observable<User> {
        return this._http.get('user',{
            usernameOrEmail:username
        }).map(
            res=>{
                
                if(res.result && res.data.length)
                    return new User(res.data[0]);
                    
                else{
                    return null;
                }
            }
        )
    }
    
}

