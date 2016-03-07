import {Injectable} from 'angular2/core';
import {JsonHttp} from '../utils/JsonHttp';
import {Observable} from 'rxjs/Observable';
import {LocalStorage} from 'angular2-local-storage/local_storage';

import {User,Group,Activity} from '../components/GroupInterface'
import {Result} from '../components/HttpResult'

@Injectable()
export class UserService {

    userId: string;
    user: User;
    profile: any;

    constructor(private _http: JsonHttp, private _localStorage: LocalStorage) {
    }

    postLogin(username: string, password: string) {
        return this._http.post('login', {
            username: username,
            password: password
        }).map(
            res =>{
                if(res.result){
                    this.userId = res.data._id;
                    this.user = new User(res.data);
                }
                return res;
            }
            );
          
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

    getGroups() : Observable<Array<Group>>{
        this.profile = this._localStorage.getObject('profile');
        return this._http.get('group', { user: this.profile._id })
        .map(res =>{
            let groups:Array<Group> = [];
            if(res.result){
                for (let i=0;i<res.data.length;i++)
                    groups.push(new Group(res.data[i]));
            }
            return groups;
        });
    }
    
    getGroupDetail(groupId) {
        return this._http.get('group/'+groupId,null);        
    }
    
    /**
     * if group._id is null 
     *  do CREATE
     * else
     *  do UPDATE
     */
    updateGroup(group:Group) : Observable<Result> {
        let postData = group.toObject();
        if(postData._id){
            return this._http.put('group/'+postData._id, postData);
        }else{
            return this._http.post('group', postData);
        }
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
    
    
    createOrUpdateActivity(activity:Activity):Observable<Result>{
        let postData = activity.toObject();
        if(postData._id){
            return this._http.put('activity/'+postData._id, postData);
        }else{
            return this._http.post('activity', postData);
        }
    }
    
    deleteActivity(activity:Activity):Observable<Result>{
        return this._http.delete('activity/'+activity._id);
    }
    
}

