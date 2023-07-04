import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  selectedDocument: Document;

  //we will listen to the documentSelectedEvent event listener here via subscribe
  constructor( private documentService: DocumentService ) { }

  ngOnInit() {
    //commenting this out for now since router will handle selection of documents to be displayed in document detail
    // this.documentService.documentSelectedEvent.subscribe((documentFromEvent: Document) => {
    //   this.selectedDocument = documentFromEvent;
    // });
  };


}

