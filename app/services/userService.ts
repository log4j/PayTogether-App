import {Injectable} from 'angular2/core';
import {JsonHttp} from '../utils/JsonHttp';

import {LocalStorage} from 'angular2-local-storage/local_storage';


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

    getGroups() {
        this.profile = this._localStorage.getObject('profile');
        return this._http.get('group', { user: this.profile._id });
    }
    
    getGroupDetail(groupId) {
        return this._http.get('group/'+groupId);        
    }
    
    getActivityList(groupId) {
        return this._http.get('activity',{
            group:groupId
        });
    }
}

