import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  //The value parameter contains the data input to the pipe that is to be transferred into a diﬀerent format.
  //The args parameter contains an array of one or more values that are needed to transform the data.
  //When the ContactsFilterPipe is used in the cms application, the value parameter will contain the array of contacts in the contact list.
  //The args parameter will contain the term or search value entered by the end user.
  //The transform method returns the transformed data.
  transform(contacts: Contact[], term: string) {
    let filteredArray: Contact[] =[];
    for (let i=0; i<contacts.length; i++) {
       let contact = contacts[i];
       if (contact.name.toLowerCase().includes(term)) {
          filteredArray.push(contact);
       }
    }
    if (filteredArray.length < 1){
       return contacts;
    }
    return filteredArray;
   }

   //below is a transform implementation using javascript filter method
//    transform(contacts: Contact[], term) {
//     let filteredContacts: Contact[] =[];
//     if (term && term.length > 0) {
//        filteredContacts = contacts.filter(
//           (contact:Contact) => contact.name.toLowerCase().includes(term.toLowerCase())
//        );
//     }
//     if (filteredContacts.length < 1){
//        return contacts;
//     }
//     return filteredContacts;
//  }

}

