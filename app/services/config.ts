import {Injectable} from '@angular/core';

@Injectable()
export class Config {
    host:string;
  constructor() {
    //   this.http = http;
    this.host = 'http://paytogether.me/';
  }

}
