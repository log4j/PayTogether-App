import {Injectable} from '@angular/core';
import {Config} from '../services/Config';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Result} from '../components/HttpResult'

@Injectable()
/**
 * sdfsdf
 */
export class JsonHttp {
    headers: Headers;
    host: string;
    constructor(private _http: Http, private _config: Config) {
        this.host = _config.host;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }

    /**
     * send post request
     */
    post(url: string, requestBody: any):Observable<Result> {
        let body = JSON.stringify(requestBody);
        return this._http.post(this.host + url, body, {
            headers: this.headers
        }).map((res: Response) => res.json());
    }
    
    /**
     * send Get request, requestParams will be attach in Uri
     */
    get(url: string, requestParams: any):Observable<Result> {
        let params: string = this.stringyParams(requestParams);
        return this._http.get(this.host + url + params, {
            headers: this.headers
        }).map((res: Response) => res.json());
    }
    
    /**
     * send Put request
     */
    put(url: string, requestBody: any) :Observable<Result>{
        let body = JSON.stringify(requestBody);
        return this._http.put(this.host + url, body, {
            headers: this.headers
        }).map((res: Response) => res.json());
    }

    /**
     * send Delete request, requestParams will be attach in Uri
     */
    delete(url: string, requestParams: any):Observable<Result> {
        let paramsString = this.stringyParams(requestParams);
        return this._http.delete(this.host + url + paramsString, {
            headers: this.headers
        }).map((res: Response) => res.json());
    }

    /**
     * stringify object params into string : ?xxx=123&yyy=456
     */
    private stringyParams(requestParams: any) {
        let params: string = "";
        for (let key in requestParams) {
            if (params === "") {
                params = "?";
            } else {
                params += "&";
            }
            params += key + "=" + requestParams[key];
        }
        return params;
    }
}
