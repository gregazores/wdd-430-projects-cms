import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  //see contacts and documents for explanation
  messages: Message[] = []

  constructor( private messageService: MessageService ) { }

  //old code
  // messages: Message[] = [
  //   new Message("1", "Test 1", "This is my first message", "Clariza Dalo"),
  //   new Message("2", "Test 2", "This is my second message", "Amor Dalo"),
  //   new Message("3", "Test 3", "This is my third message", "Isshy Dalo")
  // ];




  ngOnInit() {
    //see documents counterpart for explanation
    //this.messages = this.messageService.getMessages();
    this.messageService.getMessages();

    //we need to subscribe to an event in MessageService namely messageChangedEvent so that when that event
    //is triggered we can run a function where we get that array of messages from messageChangedEvent and
    //store in in the messages array here to be reloaded
    this.messageService.messageChangedEvent.subscribe((messagesFromChangedEvent: Message[]) => {
      this.messages = messagesFromChangedEvent;
      //console.log("new messages", this.messages)
    });
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
