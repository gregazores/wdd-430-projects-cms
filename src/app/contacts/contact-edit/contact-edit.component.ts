import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentService } from 'src/app/documents/document.service';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  //see documents for explanation
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  invalidContactAdded: boolean = false;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // subscribe to the current route and get the value of the id parameter (if it exists) from the URL.
  //If the id has a value, the form is being used to edit an existing contact.
  //Get the contact and make a clone of it.
  ngOnInit() {
    // we will need to reconfigure this block of code
    //to handle data from our froms
    // this.route.params
    // .subscribe(
    //   (params: Params) => {
    //     // console.log("params from document EDIT", params)
    //     // console.log("route from document EDIT", this.route)
    //     this.id = params.id;
    //     //console.log("documnet from document EDIT", this.documentService.getDocument(this.id));
    //     //console.log("params from document EDIT", params);
    //     this.contact = this.contactService.getContact(this.id);
    //   }
    // );

    //compare this with document version
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = params.id;

        if(!this.id) {
          this.editMode = false;
          return
        }

        this.originalContact = this.contactService.getContact(this.id);

        if(!this.originalContact) {
          return
        }

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        // if the contact has a group then
        if(this.contact.group) {
          //groupContacts = clone the contact’s group
          this.groupContacts = this.contact.group
        }
      }
    );
  }

  //see the document file equivalent
  onSubmit(dataFromTheForm: NgForm) {
    const value = dataFromTheForm.value
    //console.log('group value from the form', value)

    const newContact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    )

    if(this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact)
    }

    else {
      this.contactService.addContact(newContact)
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    //route back to the '/documents' URL
    this.router.navigate(['/contacts']);
  }

  //this will be called after successful drag and drop
  addToGroup($event: any) {
    //console.log('yes Im adding')
    const selectedContact: Contact = $event.dragData;
    //console.log('yes Im adding', selectedContact)
    const invalidGroupContact = this.isInvalidContact(selectedContact);


    if (invalidGroupContact){
      this.invalidContactAdded = invalidGroupContact
      return;
    }

    this.invalidContactAdded = invalidGroupContact
    this.groupContacts.push(selectedContact);
    //console.log('yes Im adding now')

  }

  //The purpose of this method is to determine if the newContact to be added to the group is already in the current contact’s group array.
  isInvalidContact(newContact: Contact) {
    //first determines if a new contact was passed to the method.
    if (!newContact) {// newContact has no value
      //If no contact was passed, it exits the method.
      return true;
    }

    //if the contact being added to the contact list is the same as the current contact being edited
    //ou cannot add yourself to your own group
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }

    // loops through all of the contacts in the current contact’s group array to see if the newContact.id property is equal to the id property of any contact in the group array.
   for (let i = 0; i < this.groupContacts.length; i++){
        if (newContact.id === this.groupContacts[i].id) {
          //Return true if a match is found,
          return true;
      }
    }

    //else return false.
    return false;
  }

  //The index (index) position of the contact in the groupContacts array is passed to the onRemoveItem() method.
  //If the index is outside the range of the array, the method exits. The splice() method is called to delete the item from the array.
  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
 }

}

