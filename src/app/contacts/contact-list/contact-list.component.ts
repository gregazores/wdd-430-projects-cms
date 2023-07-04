import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';

// importing the contact.service
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  //initializing contacts with an empty array
  contacts: Contact[] = []
  term: string;
  //this is how to inject the ContactService


  //see document for explanation
  private subscription: Subscription;

  constructor( private contactService: ContactService ) {
    //see documents counterpart for explanation
    //this.contacts = this.contactService.getContacts();
    this.contactService.getContacts();
  }

  // We are outputting a new EventEmitter with type contact to be listened from Parent Component
  //@Output() selectedContactEvent = new EventEmitter<Contact>();
  //we will no longer be needing the @Output event above since we will use services now
  // the event emitter will be transferred to the contact.service.ts


  //We no longer need to initialize the contacts array in the ContactListComponent class with a list of dummy contacts.
  //Instead, we will get the list of contacts from the ContactService:
  // contacts: Contact[] = [
  //   new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', '../../assets/images/jacksonk.jpg', null),
  //   new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', '../../assets/images/barzeer.jpg', null),
  // ];


  //Modify the ngOnInit() method to call the getContacts() method in the ContactService
  //and assign the array of contacts returned from the method call to the contacts class variable in the ContactListComponent.
  ngOnInit() {
    // no longer need this because of routing scheme
    //this.contacts = this.contactService.getContacts();

    // this.contactService.contactChangedEvent.subscribe((contactArray: Contact[]) => {
    //   this.contacts = contactArray;
    // });
    //see document for explanation

    //see document for explanation
    this.subscription = this.contactService.contactListChangedEvent
    .subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
      }
    );



  }

  //see documents list for explanation
  // onSelected(contactEl: Contact) {
  //   // here we are calling the event emitter created from above with a paramater of the
  //   // selected contact from contact-list html
  //   //this.selectedContactEvent.emit(contactEl);
  //   //modify the above since we have a new contactSelectedEvent emitter in contact.service.ts

  //   //using the contactSelectedEvent from contactService, we will emit an event and passt contactEl
  //   this.contactService.contactSelectedEvent.emit(contactEl);
  //}


  search(value: string) {
    //console.log('search value', value)
  this.term = value;

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
