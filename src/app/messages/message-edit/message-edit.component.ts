import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender: string = "101";
  //subjectRef and msgTextRef are local variables of type ElementRef
  //@ViewChild allows you to access the element referenced inside @ViewChil's argument here on the HTML template
  //good thing with @ViewChild the type is ElementRef which gives you access to nativeElement
  @ViewChild('subject', { static: false }) subjectRef: ElementRef;
  @ViewChild('msgText', { static: false }) msgTextRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  //we are injecting the MessageService here since we need to send the new message directly there
  constructor( private messageService: MessageService ) { }

  onSendMessage(){
    //Get the value stored in the subject input element
    const subject = this.subjectRef.nativeElement.value;
    //Get the value stored in the msgText input element
    const msgText = this.msgTextRef.nativeElement.value;

    //Create a new Message object
    //Assign a hardcoded number to the id property of the new Message object
    //Assign the value of the currentSender class variable to the sender property of the new Message object
    //Assign the values retrieved from the subject and msgText input elements to the corresponding properties of the new Message object
    const newMessage = new Message("12", subject, msgText, this.currentSender);

    //Call the addMessageEvent emitter’s emit() method and pass it the new Message object just created
    //since we are no longer sending the new message to MessageListComponent class we will comment the code below
    //this.addMessageEvent.emit(newMessage);

    //instead, we will send the new message to MessageService
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  //At the bottom of the class, implement the onClear() method.
  //This method only needs to assign a blank value to the subject and msgText input elements in the form.
  onClear() {
    this.subjectRef.nativeElement.value = "";
    this.msgTextRef.nativeElement.value = "";
  }

  ngOnInit() {}

}
