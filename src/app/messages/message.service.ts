import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//useful when you want to inject other services to this service
//will keep this @Injectable for now for reference
//but for newer versions of angular it is advisable to put @Ijectable
//UPDATE: For Angular 6+ instead of adding a service class to the providers[] array in AppModule , you can set the following config below.
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  //Create a new EventEmitter of the Message[] data type and assign it to a
  //new class variable named messageChangedEvent at the top of the MessageService class.

  //we will use event emitter this time instead of subject
  messageChangedEvent = new EventEmitter<Message[]>();

  //see contacts and documents for explanation
  messages: Message [] = [];
  //Create a new class variable called maxMessageId of the number data type
  maxMessageId: number;
  //this is the API endpoint that we should use so that we can connect to firebase
  // messageUrl: string = 'https://wdd-430-project-data-default-rtdb.asia-southeast1.firebasedatabase.app/messages.json';

  //this is the API endpoint that we should use so that we can connect to my rest api
  messageUrl: string = 'http://localhost:3000/messages';

  constructor(private http: HttpClient) {
    //see document counterpart for explanation
    //this.messages = MOCKMESSAGES;

    this.maxMessageId = this.getMaxId();
  }

  getMessages() {
  //getMessages(): Message[] {
    //see contact.service.ts for explanation
    //with sorting
    //return this.messages.sort((a, b) => a.subject > b.subject ? 1 : b.subject > a.subject ? -1 : 0).slice();

    //no sorting
    //return this.messages.slice();
    //see documents counterpart for explanation

    this.http.get<Message[]>(this.messageUrl).subscribe(
      // success method
      (messages: Message[] ) => {
        this.messages = messages
        this.maxMessageId = this.getMaxId()
        //no sorting this time
        //console.log("messages service", messages)
        //emit the next document list change event
        this.messageChangedEvent.emit(this.messages.slice());
      }, error => {
        console.log(error)
      }

  )
  }

  getMessage(id: string): Message {
    //see contact.service.ts for explanation
    return this.messages.find(( message ) => message.id === id );
  }

  deleteMessage(message: Message) {
      if (!message) {
        return;
      }

    //   //these code below is for firebase to work
    //   const pos = this.messages.indexOf(message);
    //   if (pos < 0) {
    //     return;
    //   }
    //   this.messages.splice(pos, 1);
    //   //we will need to change this to function with the newly created Subject observable
    //   //this.documentChangedEvent.emit(this.documents.slice());
    // //since we are manipulating data from firebase, we will move this event emitter
    // //to a new method called storeDocuments
    // //this.documentListChangedEvent.next(this.documents.slice())
    // this.storeMessage(this.messages.slice())

    //these code below is for my rest api to work
    const pos = this.messages.findIndex(d => d.id === message.id);
    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.messageUrl + "/" + message.id).subscribe(
      (response) => {
        this.messages.splice(pos, 1);
        this.messageChangedEvent.emit(this.messages.slice());
      }
    );


  }

  //this will be used to generate a unique id for new messages added to the message list.
  getMaxId(): number {
    //maxId = 0
    let maxId =  0;

    //for each document in the documents list
    this.messages.forEach((message) => {
      // currentId = convert document.id into a number
      const currentId = +message.id;
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

addMessage(messageFromEdit: Message) {
  //this.messages.push(messageFromEdit);

  //after pushing the new message we call on the messageChangedEvent event emitter
  // to emit the copy of the new messages hence we are using the method slice to create that copy
  //see documents counterpart for explanation
  //this.messageChangedEvent.emit(this.messages.slice());
  //this code below works for firebase
  //this.storeMessage(this.messages.slice())

  //this code below works for my rest api

  if (!messageFromEdit) {
    return;
  }
  messageFromEdit.id = '';
  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, msg: Message }>(this.messageUrl,
    messageFromEdit,  { headers: headers }).subscribe(
      (responseData) => {
          // add new contact to contacts
          //console.log("this.messages.push", responseData)
          this.messages.push(responseData.msg);
          this.messageChangedEvent.emit(this.messages.slice());
      }
    );



}

storeMessage(messagesToStore: Message[])  {

  //Create a new HttpHeaders object that sets the Content-Type of the HTTP request to application/json.
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  this.http.put(
    this.messageUrl,
    //Convert the documents array into a string format by calling the JSON.stringify()
    JSON.stringify(messagesToStore),
    httpOptions
  ).subscribe(
    (response) => {
      console.log(response)
      this.messageChangedEvent.emit(this.messages.slice());
    }
  )
 }




}
