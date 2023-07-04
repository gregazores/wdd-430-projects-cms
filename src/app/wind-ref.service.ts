import { Injectable } from '@angular/core';


//useful when you want to inject other services to this service
//will keep this @Injectable for now for reference
//but for newer versions of angular it is advisable to put @Ijectable
//UPDATE: For Angular 6+ instead of adding a service class to the providers[] array in AppModule , you can set the following config below.
@Injectable({
  providedIn: 'root'
})
export class WindRefService {

  constructor() { }

  getNativeWindow() {
    return window;
 }

}
