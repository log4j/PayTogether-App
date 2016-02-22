import {Injectable} from 'angular2/core';

@Injectable()
export class Config {
    host:string;
  constructor() {
    //   this.http = http;
    this.host = 'http://paytogether.me/';
  }

}
