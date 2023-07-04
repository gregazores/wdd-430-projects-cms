import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  //define our variable
  document: Document;
  nativeWindow: any;
  id: string;



  //inject a DocumentService, Router, and ActivatedRoute into the DocumentDetailComponent.
  //Modify the constructor() method to inject an instance of the WindRefService into the DocumentDetailComponent class. You will need to import the WindRefService.
  constructor( private documentService: DocumentService,
                private windowRefService: WindRefService,
                private route: ActivatedRoute,
                private router: Router
              ) {
                this.nativeWindow = windowRefService.getNativeWindow()
               }

  //we will no longer receive data from our parent component
  //instead, we will inject Document service to get the data of one document based on the parameter on the URL
  //to do so, we will subscribe to route.params
  //@Input() document: Document;

  //Implement the ngOnInit() lifecycle method and subscribe to the parameters of the active route.
  //Pass an arrow (=>) function to the subscribe() method as an input.
  //This function is automatically called each time the current route is modified.
  //The arrow function will receive the route’s input parameters (params) as an input.
  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          //console.log("params from document details", params)
          this.id = params.id;
          this.document = this.documentService.getDocument(this.id);
        }
      );
  }

  // Add a new method to the DocumentDetailComponent class named onView()
  // Inside the method, get the value of the url property of the Document object referenced in the document property.
  // Then, call the nativeWindow object’s open(url) method to open a new tab in the browser and link to the document’s URL property.
  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  //The DocumentDetailComponent needs to call a method to delete the document when its Delete button is selected.
  onDelete() {
    this.documentService.deleteDocument(this.document);
    //route back to the '/documents' URL
    this.router.navigate(['/documents']);
 }

}
