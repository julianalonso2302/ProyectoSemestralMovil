import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx'; 
import { Camera as IonicNativeCamera } from '@ionic-native/camera/ngx'; 
import { PhotoLibrary } from '@ionic-native/photo-library/ngx'; 
import { GoogleMaps } from '@ionic-native/google-maps/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    NativeStorage,
    Camera,
    IonicNativeCamera, 
    PhotoLibrary,
    GoogleMaps 
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
