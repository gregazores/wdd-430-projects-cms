import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent implements OnInit {
  //@Input allows parent component to access this property contact
  // parent element can now bind and pass data
  //@Input('alias') --you can do alias for @Input and use this alias outside (parent element for example)
  @Input() contact: Contact;

  constructor() { }

  ngOnInit() {

  }



}

