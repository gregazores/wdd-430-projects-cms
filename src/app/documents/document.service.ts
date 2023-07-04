import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//useful when you want to inject other services to this service
//will keep this @Injectable for now for reference
//but for newer versions of angular it is advisable to put @Injectable
//UPDATE: For Angular 6+ instead of adding a service class to the providers[] array in AppModule , you can set the following config below.
@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  //moving the event emitter from DocumentListComponent class to here
  //DocumentsComponent is subscribing this event emitter
  //and document list is using this event emitter to transmit data to DocumentsComponent
  //documentSelectedEvent = new EventEmitter<Document>();
  //we will comment this out since router will handle the selection of document detail

  //this will replace eventEmitters in sending data
  //Define a new class variable called documentListChangedEvent to the top of the DocumentServiceClass.
  //Create and assign a new Subject object whose datatype is an array of Document objects to the variable.
  documentListChangedEvent = new Subject<Document[]>();

  //Create a new class variable called maxDocumentId of the number data type
  maxDocumentId: number;
  //this is the API endpoint that we should use so that we can connect to firebase
  //documentUrl: string = 'https://wdd-430-project-data-default-rtdb.asia-southeast1.firebasedatabase.app/documents.json';


  //this is the API endpoint that we should use so that we can connect to my rest api
  documentUrl: string = 'http://localhost:3000/documents';

  //this will emit an event whenever a document is deleted from document detail's delete button
  //and pass an array of documents of Document type
  //documentChangedEvent = new EventEmitter<Document[]>();
  //commenting out the above code for now since we will use the new Subject observable

  documents: Document [] = [];

  //Inject the HttpClient object into the DocumentService class through dependency injection.
  constructor(private http: HttpClient) {
    //commenting this out since we will use data from firebase
    //this.documents = MOCKDOCUMENTS;

    //Inside the constructor() method of the DocumentService class call the
    //getMaxId() function and assign the value returned to the maxDocumentId class variable.
    this.maxDocumentId = this.getMaxId();
    //this.addDocument(null)
  }


  getDocuments() {
  //instead of returning array of documents, this method will now emit the documentListChangedEvent subject and pass it a cloned copy of the documents array to notify the
  //getDocuments(): Document[] {
    //this time we will use http requests
    //see contact.service.ts for explanation
    //return this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).slice();

    this.http.get<Document[]>(this.documentUrl).subscribe(
        // success method
        (documents: Document[] ) => {
          this.documents = documents
          this.maxDocumentId = this.getMaxId()
          //sort the list of documents
          this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
          //emit the next document list change event
          this.documentListChangedEvent.next(this.documents.slice());
        }, error => {
          console.log(error)
        }

    )
  }

  getDocument(id: string): Document {
    //see contact.service.ts for explanation
    return this.documents.find(( document ) => document.id === id );
  }


  //Create a method in the DocumentService to delete the document from its documents list.
  //This method first validates to see if an actual document was passed to the method.
  //The method is aborted if no document was passed.
  //It then calls the indexOf() array method to get the index position of the document in the document list.
  //If the index is negative, the document was not found and the method is aborted.
  //The splice() array method is then called to remove the document at the specified index position from the array.
  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    //we will need to change this to function with the newly created Subject observable
    //this.documentChangedEvent.emit(this.documents.slice());
   //since we are manipulating data from firebase, we will move this event emitter
   //to a new method called storeDocuments
   //this.documentListChangedEvent.next(this.documents.slice())
   this.storeDocuments(this.documents.slice())
 }

  //getMaxId(): Number with this config function is expected to return a value of type Number
  getMaxId(): number {
      //maxId = 0
      let maxId =  0;

      //for each document in the documents list
      this.documents.forEach((document) => {
        // currentId = convert document.id into a number
        const currentId = +document.id;
        //if currentId > maxId then
        if(currentId > maxId) {
          //maxId = currentId
          maxId = currentId;
          //endIf
        }
      })
      //endFor

    //console.log('maxId', maxId)
    return maxId;
  }

 //Create the addDocument() function in the DocumentService class.
 addDocument(newDocument: Document) {
   if(!newDocument) {
    //console.log("new document null")
    //console.log("this.maxDocumentId", typeof this.maxDocumentId)
    return;
   }


  //  //method below is for firebase data
  //  //this.maxDocumentId++
  //  this.maxDocumentId++;
  //  //newDocument.id = this.maxDocumentId
  //  newDocument.id = String(this.maxDocumentId);
  //  //push newDocument onto the documents list
  //  this.documents.push(newDocument)
  //  //documentsListClone = documents.slice()
  //  //since we are manipulating data from firebase, we will move this event emitter
  //  //to a new method called storeDocuments
  //  //this.documentListChangedEvent.next(this.documents.slice())
  //  this.storeDocuments(this.documents.slice())


   //method below is for the new rest API
   // make sure id of the new Document is empty
   newDocument.id = '';
   const headers = new HttpHeaders({'Content-Type': 'application/json'});
   // add to database
   this.http.post<{ message: string, document: Document }>(this.documentUrl,
   newDocument,  { headers: headers }).subscribe(
    (responseData) => {
      // add new document to documents
      this.documents.push(responseData.document);
      console.log('this.documents', this.documents)
      console.log('responseData.document', responseData.document)
      //this.sortAndSend();
    }
  );

 }

 updateDocument(originalDocument: Document, newDocument: Document) {
   if(!originalDocument || !newDocument) {
      return
   }

   let pos = this.documents.indexOf(originalDocument)
   if(pos < 0) {
      return
   }

   newDocument.id = originalDocument.id;
   this.documents[pos] = newDocument;
   //const documentsListClone = this.documents.slice()
   //since we are manipulating data from firebase, we will move this event emitter
   //to a new method called storeDocuments
   //this.documentListChangedEvent.next(this.documents.slice())
   this.storeDocuments(this.documents.slice())

 }

 //This method will be called when a Document object is added, updated, or deleted in the document list.
 //It will issue an HTTP Put request to update the document list in your Firebase database server.
 storeDocuments(documentsToStore: Document[])  {

  //Create a new HttpHeaders object that sets the Content-Type of the HTTP request to application/json.
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  this.http.put(
    this.documentUrl,
    //Convert the documents array into a string format by calling the JSON.stringify()
    JSON.stringify(documentsToStore),
    httpOptions
  ).subscribe(
    (response) => {
      console.log(response)
      this.documentListChangedEvent.next(this.documents.slice())
    }
  )
 }


}
