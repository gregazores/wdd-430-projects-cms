import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//useful when you want to inject other services to this service
//will keep this @Injectable for now for reference
//but for newer versions of angular it is advisable to put @Ijectable
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  //see document for explanation
  //contactSelectedEvent = new EventEmitter<Contact>();

  //this will emit an event whenever a contact is deleted from contact detail's delete button
  //and pass an array of contacts of Contact type
  //contactChangedEvent = new EventEmitter<Contact[]>();
  //commenting this out see document for explanation

  contactListChangedEvent = new Subject<Contact[]>();

  //see documents
  maxContactId: number;
  //this is the API endpoint that we should use so that we can connect to firebase
  contactUrl: string = 'https://wdd-430-project-data-default-rtdb.asia-southeast1.firebasedatabase.app/contacts.json';

  //creating a class variable named contacts whose data type is an array of contact objects.
  //Initialize the variable with an empty array ([])
  contacts: Contact[] = [];

  //Inside the constructor method, assign the value of the MOCKCONTACTS variable defined in the MOCKCONTACTS.ts file to the contacts class variable in the ContactService class.

  //Inject the HttpClient object into the DocumentService class through dependency injection.
  constructor(private http: HttpClient) {
    //commenting this out since we will use data from firebase
    //this.contacts = MOCKCONTACTS;
    //see documents
    this.maxContactId = this.getMaxId();
  }

  //Adding a new method with the following signature: getContacts(): Contact[]
  //A function signature (or type signature, or method signature) defines input and output of functions or methods.
  getContacts() {
  //see the documents counterpart for explanation
  //getContacts(): Contact[] {
    //below is from the manual
    //return this.contacts.slice();

    //we can insert a sort method to arrange the search results
    // the compare function works this way:
    //If a.name is greater than b.name the result is positive, a is sorted before b.
    // If b.name is greater than a.name the result is negative, b is sorted before a.
    //If the result is 0, no changes are done with the sort order of the two values.

    //see the documents counterpart for explanation
    // return this.contacts
    //   .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    //   .slice();

    //see the documents counterpart for explanation
    this.http.get<Contact[]>(this.contactUrl).subscribe(
      // success method
      (contacts: Contact[] ) => {
        this.contacts = contacts
        this.maxContactId = this.getMaxId()
        //sort the list of documents
        this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).slice();
        //emit the next document list change event
        this.contactListChangedEvent.next(this.contacts.slice());
      }, error => {
        console.log(error)
      }

  )
  }

  //a method to find a specific Contact object in the contacts array based on the id
  getContact(id: string): Contact {
    // this is the algorithm
    // FOR each contact in the contacts list
    // IF contact.id equals the id THEN
    // RETURN contact
    // ENDIF
    // ENDFOR
    // RETURN null

    //simple solution using the javascript method find
    return this.contacts.find((contact) => contact.id === id);
  }

  //see documents services for explanation
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    //this.contactChangedEvent.emit(this.contacts.slice());
    //see document for explanation

    //this.contactListChangedEvent.next(this.contacts.slice());
    //see documents counterpart for explanation
    this.storeContacts(this.contacts.slice())
  }

  getMaxId(): number {
    //maxId = 0
    let maxId = 0;

    //for each contact in the contacts list
    this.contacts.forEach((contact) => {
      // currentId = convert contact.id into a number
      const currentId = +contact.id;
      //if currentId > maxId then
      if (currentId > maxId) {
        //maxId = currentId
        maxId = currentId;
        //endIf
      }
    });
    //endFor

    //console.log('maxId', maxId)
    return maxId;
  }

  //Create the addContact() function in the ContactService class.
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    //this.maContactId++
    this.maxContactId++;
    //newContact.id = this.maxContactId
    newContact.id = String(this.maxContactId);
    //push newContact onto the contacts list
    this.contacts.push(newContact);
    //contactsListClone = contacts.slice()
    //const contactListClone = this.contacts.slice()
    //this.contactListChangedEvent.next(this.contacts.slice());
    //see documents counterpart for explanation
    this.storeContacts(this.contacts.slice())
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    //const contactListClone = this.contact.slice()
    //this.contactListChangedEvent.next(this.contacts.slice());
    //see documents counterpart for explanation
    this.storeContacts(this.contacts.slice())
  }

  storeContacts(contactsToStore: Contact[])  {

    //Create a new HttpHeaders object that sets the Content-Type of the HTTP request to application/json.
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.put(
      this.contactUrl,
      //Convert the documents array into a string format by calling the JSON.stringify()
      JSON.stringify(contactsToStore),
      httpOptions
    ).subscribe(
      (response) => {
        console.log(response)
        this.contactListChangedEvent.next(this.contacts.slice())
      }
    )
   }

}
