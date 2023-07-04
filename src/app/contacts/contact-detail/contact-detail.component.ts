import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  //define our variables
  groupContacts: Contact[] = [];
  contact: Contact;
  id: string;

  //we will no longer receive data from our parent component see document details
  //@Input() contact: Contact;

  constructor( private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {   }

  ngOnInit() {

    this.route.params
      .subscribe(
        (params: Params) => {
          //console.log("params from document details", params)
          this.id = params.id;
          this.contact = this.contactService.getContact(this.id);
          console.log('contact-detail', this.contact)

          // if the contact has a group then
          if(this.contact.group) {
            //groupContacts = clone the contact’s group
            this.groupContacts = this.contact.group
          }

        }
      );
  }

  //see document detail
  onDelete() {
    this.contactService.deleteContact(this.contact);
    //route back to the '/documents' URL
    this.router.navigate(['/contacts']);
 }
}
