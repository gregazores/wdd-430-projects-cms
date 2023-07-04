import { Component, OnInit, Input } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit{
  @Input() message: Message;

  //Add a new class variable named messageSender of the string data type to the top of the class.
  messageSender: String;

  //injecting ContactService here
  constructor( private contactService: ContactService ) { }

  ngOnInit() {
    //since we no have access to the ContactService we can use the getContact method passing in the id
    // where is this.message.sender referencing to? it is from @Input() message: Message;
    const contact: Contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact.name;
  }
}

