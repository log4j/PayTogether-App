import {Injectable} from 'angular2/core';
import {JsonHttp} from '../utils/JsonHttp';
import {Observable} from 'rxjs/Observable';
import {LocalStorage} from 'angular2-local-storage/local_storage';

import {User} from '../components/GroupInterface'
import {Result} from '../components/HttpResult'

@Injectable()
export class GroupService {


    constructor(private _http: JsonHttp, private _localStorage: LocalStorage) {

    }

    
    
}

