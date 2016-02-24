import {Observable} from 'rxjs/Observable';

interface IUser {
    _id: string;
    displayName: string;
    email: string;
    gender: string;
    avatar: string;
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
    users: IUser[];
    name: string;
    
    constructor(
    ){
        
    }
    
    addMember(name:string):Observable<string>{
        return new Observable<string>(
            observer => {
                
            }
        );
    }
}