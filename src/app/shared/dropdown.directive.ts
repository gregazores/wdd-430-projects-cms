//don't forget to upload this into the app.module.ts file in order to use this

import { Directive, HostListener, HostBinding } from "@angular/core";

//should have the @Directive decorator for angular to know that this is a directive
@Directive({
  //this is how the selector should look like for the custom directive that we are creating
  selector: '[cmsDropdown]'
})
export class DropdownDirective {
  //@HostBinding is a property decorator that is used to bind to a property of a hosting element.
  //this time we are binding to the "isOpen" property which is initially set to false
  //inside the @HostBinding property, we can pass a string inside the parenthesis defining to which property of the HOSTING ELEMENT we want to bind
  //in this case we want to bind to the ELEMENT'S class property and and class "open" each time "isOpen" property is false.
  //at this time, I'm still not sure to where "isOpen" property belong: to the host property? or the DropdownDirective class?
  @HostBinding('class.open') isOpen = false;

  //@HostListener is an event decorator that is used to listen to an event of a hosting element.
  //for this one we want to listen for a click event and execute the toggleOpen function
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
