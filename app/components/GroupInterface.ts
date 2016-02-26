import {Observable} from 'rxjs/Observable';
import {Result} from './HttpResult'

export interface IUser {
    _id: string;
    displayName: string;
    username: string;
    email: string;
    gender: string;
    avatar: string;
    invisible: boolean;
}

export class User implements IUser{
    _id: string;
    displayName: string;
    username: string;
    email: string;
    gender: string;
    avatar: string;
    invisible: boolean = false;
    
    
    constructor(data:any){
        if(typeof data === "string"){
            this.displayName = data;
            this.invisible = true;
        }
        else if(data){
            if(data._id)
                this._id = data._id;
            if(data.username)
                this.username = data.username;
            if(data.displayName)
                this.displayName = data.displayName;
            if(data.gender)
                this.gender = data.gender;
            if(data.avatar)
                this.avatar = data.avatar;
            if(data.email)
                this.email = data.email;
                
            if(data.invisible)
                this.invisible = data.invisible;
        }
    }
}

/**
 * interface for Group model
 */
interface IGroup {
    _id: string;
    users: IUser[];
    name: string;
}

export class Group implements IGroup{
    
    _id: string;
    users: User[];
    name: string;
    
    constructor(
    ){
        this.users = [];
        // this.addMember('test ')
        // .subscribe(
        //     res =>{
        //         console.log(res);
        //     }
        // )
        
    }
    
    addMember(user: User):boolean {
        
        //check whether this name already exist;
        for(let i=0;i<this.users.length;i++){
            
            if(user._id && user._id == this.users[i]._id){
                return false;
            }
            if(user.displayName == this.users[i].displayName){
                return false;
            }
        }
        this.users.push(user);
        return true;
    }

    removeMember(index: number):boolean {
        if(index>=0 && index<this.users.length){
            this.users.splice(index,1);
            return true;
        }
        return false;
    }    
    // return new Observable<Result>(
    //                 observer => {
    //                     let result:Result;
    //                     result = {
    //                         result: false,
    //                         err: 'EXISTED'
    //                     }
    //                     observer.next(result);
    //                     observer.complete();
    //                 }
    //             );
}