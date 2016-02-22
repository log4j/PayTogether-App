import {App, IonicApp, Platform} from 'ionic-framework/ionic';
import {Injectable, OnDestroy} from 'angular2/core';
import {Config} from './services/Config'
import {JsonHttp} from './utils/JsonHttp'
import {UserService} from './services/UserService'


import {AccountPage} from './pages/account/account';
import {WelcomePage} from './pages/welcome/welcome';
import {ListPage} from './pages/list/list';
import {GroupListPage} from './pages/group-list/group-list';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';

import {BusyComponent, BusyCtrl} from './components/busy-component/busy-component';

import {LocalStorage} from 'angular2-local-storage/local_storage';


@App({
    templateUrl: 'build/app.html',
    config: {}, // http://ionicframework.com/docs/v2/api/config/Config/,
    providers: [Config, JsonHttp, UserService, BusyCtrl, LocalStorage],
    directives: [BusyComponent]
})
class MyApp {
    // make HelloIonicPage the root (or first) page
    rootPage: Type = AccountPage;
    pages: Array<{ title: string, component: Type }>;

    constructor(private app: IonicApp, private platform: Platform) {


        this.initializeApp();

        // set our app's pages
        this.pages = [
            { title: 'Group List', component: GroupListPage }
            // { title: 'My First List', component: ListPage }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // The platform is now ready. Note: if this callback fails to fire, follow
            // the Troubleshooting guide for a number of possible solutions:
            //
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            //
            // First, let's hide the keyboard accessory bar (only works natively) since
            // that's a better default:
            //
            // Keyboard.setAccessoryBarVisible(false);
            //
            // For example, we might change the StatusBar color. This one below is
            // good for dark backgrounds and light text:
            // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
            //LocalStorageSubscriber(this.app);
      
        });
    }

    openPage(page) {
        // close the menu when clicking a link from the menu
        this.app.getComponent('leftMenu').close();
        // navigate to the new page if it is not the current page
        let nav = this.app.getComponent('nav');
        nav.setRoot(page.component);
    }

    logout() {
        this.app.getComponent('leftMenu').close();
        // navigate to the new page if it is not the current page
        let nav = this.app.getComponent('nav');
        nav.setRoot(AccountPage);
    }
}
