import { NgModule } from '@angular/core';
//You will need to import the Routes and RouterModule classes from the @angular/router Angular library.
import { Routes, RouterModule } from '@angular/router';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DocumentDetailComponent } from './documents/document-detail/document-detail.component';
import { DocumentEditComponent } from './documents/document-edit/document-edit.component';

import { DocumentsComponent } from './documents/documents.component';
import { MessageListComponent } from './messages/message-list/message-list.component';


//Define a literal array of JSON objects to define each of the routes
const appRoutes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentsComponent, children: [
    //the position of 'new' here is important because if you put this route
    //after :id then when you put new in the url angular is going to interpret that as a
    //variabel for the :id
    { path: 'new', component: DocumentEditComponent },
    { path: ':id', component: DocumentDetailComponent },
    { path: ':id/edit', component: DocumentEditComponent }
  ]},
  { path: 'messages', component: MessageListComponent },
  { path: 'contacts', component: ContactsComponent, children: [
    { path: 'new', component: ContactEditComponent },
    { path: ':id', component: ContactDetailComponent },
    { path: ':id/edit', component: ContactEditComponent }
  ] }
];


//Use the @NgModule annotation to create a new module.
//Import the RouterModule module and define the root route in the imports property.
//Set the value of the exports property to export the RouterModule.
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

//Define the AppRoutingModule class and export it.
export class AppRoutingModule {

}
