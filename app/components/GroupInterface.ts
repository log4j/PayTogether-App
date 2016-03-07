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
    
    /**
     * money related
     */
    totalSpent:number = 0;
    totalPaid:number = 0;
    totalReceived:number = 0;
    activityHistory:any;

    
    constructor(data?:any){
        if(data){
            if(typeof data === "string"){
                this._id = data;
            }else{
                this.setDataByJson(data);
            }
        }
    }
    
    setDataByDisplayName(data:string){
        this.displayName = data;
        this.username = data;
        this.invisible = true;
    }
    
    /**
     * data should be either Json Data for group or simple ID string
     */
    setData(data:any){
        if(data){
            if(typeof data === "string"){
                this._id = data;
            }else{
                this.setDataByJson(data);
            }
        }
    }
    
    private setDataByJson(data:any){
        if(data){
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
    
    
    static createUserByDisplayName(displayName:string){
        let user = new User();
        user.setDataByDisplayName(displayName)
        return user;
    }
}

/**
 * interface for Group model
 */
interface IGroup {
    _id: string;
    users: IUser[];
    name: string;
    creator: User;
    icon: string;
    color: string;
}

export class Group implements IGroup{
    
    _id: string;
    users: User[];
    activities: Activity[];
    name: string;
    creator: User;
    icon: string;
    color: string;
    
    /**
     * for money things
     */
    totalSpent:number;
    totalPaid:number;
    stats:any;
    
    userOwned:number = 0;
    userPaid:number = 0;
    userReceived:number = 0;
    userSpent:number = 0;
    
    
    constructor(data?:any
    ){
        if(data){
            if(typeof data === "string"){
                this._id = data;
                this.users = [];
            }else{
                this.updateDataByJson(data);
            }
        }
        
    }
    
    /**
     * add a User as member among this Group
     */
    addMember(user: User):boolean {
        if(!this.users)
            this.users = [];
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

    /**
     * remove a member(User) according to an index value
     */
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
    
    /**
     * update the whole content of this Group by a new Json Data
     */
    updateDataByJson(data:any){
        this.users = [];
        if(data){
            this._id = data._id;
            this.name = data.name;
            this.icon = data.icon;
            this.color = data.color;
            this.creator = new User(data.creator);
            this.userOwned = data.userOwned;
            this.userPaid = data.userPaid;
            this.userReceived = data.userReceived;
            this.userSpent = data.userSpent;
            
            for(let i=0;i<data.users.length;i++){
                this.users.push(new User(data.users[i]));
            }
            
            this.updateBalance();
        }
    }
    
    updateActivitiesByJson(data:any){
        this.activities = []
        if(data){
            for(let i=0;i<data.length;i++)
                this.activities.push(new Activity(data[i]));
                
            this.updateBalance();
        }
    }
    
    
    updateBalance () {
        if (!this.activities)
            return;
        
        //build user map and initialize value
        let userMap = {};
        this.totalSpent = 0;
        for (let i = 0; i < this.users.length; i++) {
            this.users[i].totalPaid = 0;
            this.users[i].totalSpent = 0;
            this.users[i].totalReceived = 0;
            this.users[i].activityHistory = [];
            userMap[this.users[i]._id] = this.users[i];
        }


        for (let i = 0; i < this.activities.length; i++) {
            let act = this.activities[i];
            
            //who paid
            userMap[act.from._id].totalPaid += act.amount;
            //who spent
            for (let j = 0; j < act.to.length; j++) {
                if (act.isPay)
                    userMap[act.to[j].user._id].totalSpent += act.to[j].final;
                else
                    userMap[act.to[j].user._id].totalReceived += act.to[j].final;
            }
            //total amount
            if (act.isPay)
                this.totalSpent += act.amount;
            //else
            
            
            
            //if this is transfer, add 0 to others
            if (!act.isPay) {
                for (var k = 0; k < this.users.length; k++) {
                    if (this.users[k]._id == act.to[0].user._id)
                        this.users[k].activityHistory.push(act.to[0].final);
                    else
                        this.users[k].activityHistory.push(0);
                }
            } else {
                for (var j = 0; j < act.to.length; j++) {
                    userMap[act.to[j].user._id].activityHistory.push(act.to[j].final);
                }
            }


        }
        
        /**
         * in case when try to calculate the rate and divide by zero, make it 0.0001
         * it won't effect the total value since we just display $0.00 
         * */
        if (this.totalSpent == 0)
            this.totalSpent = 0.0001;
        
        
        //build activity stats data
        var stats = {
            title: ['What for'],
            data: []
        };

        for (let i = 0; i < this.activities.length; i++) {
            stats.data.push({
                from: this.activities[i].from.displayName,
                amount: this.activities[i].amount,
                name: this.activities[i].name,
                type: this.activities[i].isPay ? 'Pay' : 'Transfer',
                is_pay: this.activities[i].isPay,
                date: this.activities[i].date,
                data: []
            });
        }

        for (var i = 0; i < this.users.length; i++) {
            var user = this.users[i];

            stats.title.push(user.displayName);


            for (var j = 0; j < this.activities.length; j++) {
                stats.data[j].data.push(user.activityHistory[j]); 
                //stats.data[j].data.push($filter('currency')(user.activityHistory[j], '$', 2));   
            }
        }

        stats.title.push('Amount');
        stats.title.push('Paid By');


        this.stats = stats;

    }
    
    /**
     * JSON => stringify
     */
    toObject():any {
        let obj = {
            _id: this._id,
            name: this.name,
            creator: this.creator._id,
            color: this.color,
            users: []
        }
        for(let i=0;i<this.users.length;i++){
            obj.users.push({
                _id: this.users[i]._id,
                username: this.users[i].username,
                email: this.users[i].email
            });
        }
        return obj;
    }
}

export class Share{
    amount:number;
    final:number;
    percentage:number;
    selected:boolean;
    user:User;
    
    constructor(data?:any){
        this.amount = data.amount;
        this.final = data.final;
        this.percentage = data.percentage;
        this.selected = data.selected;
        this.user = new User(data.user);
    }
    
    toObject() : any {
        return {
            amount: this.amount,
            final: this.final,
            percentage: this.percentage,
            selected: this.selected,
            user: this.user._id
        }
    }
}

export class Activity {
    _id: string;
    from: User;
    amount: number;
    to: Share[];
    isPay: boolean;
    name:string;
    date: Date;   
    sharedByPercentage: boolean;
    group: Group;
    
    constructor(data:any){
        this.to = [];
        if(data){
            this._id = data._id;
            this.from = new User(data.from);
            this.amount = data.amount;
            this.isPay = data.is_pay;
            this.name = data.name;
            this.sharedByPercentage = data.share_by_percentage;
            this.group = new Group(data.group);
            
            for(let i=0;i<data.to.length;i++)
                this.to.push(new Share(data.to[i]))
                
                
        }
    }
    
    initialToByUsers(users:User[]){
        this.to = [];
        for(let i=0;i<users.length;i++)
            this.to.push(new Share({
                amount:0,
                final: 0,
                percentage: 0,
                selected: true,
                user: users[i]
            }));
    }
    
    initialToByOneUser(user:User){
        this.to = [];
        this.to.push(
            new Share({
                amount:0,
                final: 0,
                percentage: 0,
                selected: true,
                user: user
            })
        );
        this.to[0].user = user;
    }
    
    toObject():any {
        let obj = {
            _id: this._id,
            name: this.name,
            group: this.group._id,
            amount: this.amount,
            from: this.from._id,
            date: this.date,
            is_pay: this.isPay,
            share_by_percentage: this.sharedByPercentage,
            to: []
        }
        for(let i=0;i<this.to.length;i++){
            obj.to.push(this.to[i].toObject());
        }
        return obj;
    }
}