import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { VineTrackerApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CoreStoreModule } from './core/store/store.module';

import { HttpModule, Http } from '@angular/http';
import { AuthenticatedHttpService } from './core/services/http-interceptor/http-interceptor.service';

import { FaIconComponent } from './core/components/fa-icon/fa-icon.component';
@NgModule({
  declarations: [
    VineTrackerApp,
    ContactPage,
    TabsPage,
    FaIconComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(VineTrackerApp, {
      preloadModules: true
    }),
    CoreStoreModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    VineTrackerApp,
    ContactPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: Http, useClass: AuthenticatedHttpService },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule { }
