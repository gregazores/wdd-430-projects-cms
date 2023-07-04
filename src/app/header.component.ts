import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.Emulated // other choices None (no unique attributes added to the DOM no view encapsulation) and ShadowDom (same with emulated but for browsers that support ShadowDom)
})
export class HeaderComponent {

  // we will no longer need these below for angular routing
  // @Output makes your selectedFeatureEvent listenable from outside can also assign an alias @Output('alias')
  // @Output() selectedFeatureEvent = new EventEmitter<string>();
  //selectedEvent is just a string describing which button is clicked -Documents, Messages, Contacts
  // onSelected(selectedEvent: string) {
  //   this.selectedFeatureEvent.emit(selectedEvent);
  // }

}
