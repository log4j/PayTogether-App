import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Config} from './Config'
import 'rxjs/Rx';

@Injectable()
export class UserService {
    host:string;
  constructor(private _http: Http, private _config:Config) {
    //   this.http = http;
    this.host = this._config.host;
    

  }

  postLogin(username:string,password:string){
    //   console.log(data,this.host);
      
      return this._http.post(this.host+'login',JSON.stringify({
          username:username,
            password:password}))
        .map((res:Response)=>res.json());
      
     // return this._http.get(this.host+'group?user=56b14506d046d8d202d06e51')
       //.map((res:Response)=>res.json())
    //   .subscribe(
    // //    data => console.log(data),
    // //   err => this.logError(err),
    //   () => console.log('Random Quote Complete')
    // );
  }
}
