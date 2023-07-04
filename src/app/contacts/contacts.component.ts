import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
// importing the contact.service
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit{
  selectedContact: Contact;

  //this is how to inject the ContactService
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    //see document for explanation
    // this.contactService.contactSelectedEvent.subscribe((contactFromEvent: Contact) => {
    //     this.selectedContact = contactFromEvent;
    //   }
    // );
  }

}
