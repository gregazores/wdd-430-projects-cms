import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  //define our variables
  originalDocument: Document; //originalDocument property references the original, unedited version of the document.
  document: Document;
  id: string;
  editMode: boolean = false; //editMode property indicates whether an existing document is to be edited or a new document is being created.

  //we will no longer need this for template-driven form
  //but I will keep this since I have methods that I have created for fun
  @ViewChild('name', { static: false }) nameRef: ElementRef;
  @ViewChild('description', { static: false }) descriptionRef: ElementRef;
  @ViewChild('url', { static: false }) urlRef: ElementRef;

  constructor( private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {

    // we will comment this out for now since we need to configure if we are in edit mode or not
    // this.route.params
    // .subscribe(
    //   (params: Params) => {
    //     // console.log("params from document EDIT", params)
    //     // console.log("route from document EDIT", this.route)
    //     this.id = params.id;
    //     //console.log("documnet from document EDIT", this.documentService.getDocument(this.id));
    //     //console.log("params from document EDIT", params);
    //     this.document = this.documentService.getDocument(this.id);
    //   }
    // );

    //algorithm subscribes to the currently active route to get the value of the id parameter in the router’s parameter list.
    //params of the route is actually an observable which reacts or waits or gets triggered whenever parameter of the current loaded or route gets change or loaded or activated
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;
        //If the id parameter is not found in the parameter list,
        //the component is being used to add a new document to the document list
        //and editMode is set to false;
        if(!this.id) {
          this.editMode = false;
          //console.log('we are in new mode', this.editMode)
          //console.log('we are in edit mode', this.editMode)
          return
        }

        //The Document object is retrieved by calling the getDocument() method in the DocumentService
        //and assigned to the originalDocument property.
        this.originalDocument = this.documentService.getDocument(this.id);
        //console.log('originalDocument', this.originalDocument)


        //the method exits if no document is found ie originalDocument empty.
        if(!this.originalDocument) {
          //console.log('originalDocument empty')
          return
        }

        //otherwise, we are in edit mode so we set editMode to true
        this.editMode = true;
        //console.log('we are in edit mode', this.editMode)
        //and a clone (copy) of the originalDocument is assigned to the document property if the document was found.
        // commenting this out since there is a better method provided by the assignment
        //this.document = this.originalDocument;

        //The original JSON object stored in the originalDocument property is passed to the JSON stringify() method.
        //It returns a string representation of the JSON object.
        //Then, we call the JSON parse() method and pass it the string returned from the stringify() method.
        //The parse() method creates and returns a new JSON object based on the string passed to it.
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    )
  }

  onSubmit(dataFromTheForm: NgForm) {
    // get values from form’s fields
    const value = dataFromTheForm.value
    //creates a new Document object and assigns the values retrieved from each of the input fields
    //to the corresponding properties in the new Document object.
    const newDocument = new Document(
      value.id,
      value.name,
      value.description,
      value.url,
      value.children
    )

    //if the component is in edit mode, the DocumentService updateDocument() method is called.
    if(this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument)
    }

    //Otherwise, the DocumentService addDocument() method is called.
    else {
      this.documentService.addDocument(newDocument)
    }

    //Finally, it routes back to the main documents view.
    this.router.navigate(['/documents']);
  }

  onCancel() {
    //route back to the '/documents' URL
    this.router.navigate(['/documents']);
  }


  //this method I created just for fun
  onUpdateDocument(){
    const newDocument = this.document
    newDocument.name = this.nameRef.nativeElement.value// || newDocument.name;
    newDocument.description = this.descriptionRef.nativeElement.value// || newDocument.description;
    newDocument.url = this.urlRef.nativeElement.value// || newDocument.url;

    //const editedDocument = new Message("12", subject, msgText, this.currentSender);

    this.documentService.updateDocument(this.document, newDocument)
    //this.messageService.addMessage(newMessage);
    //this.onClear();
    this.router.navigate(['/documents']);
  }

  //this method I created just for fun
  onClear() {
    this.nameRef.nativeElement.value = "";
    this.descriptionRef.nativeElement.value = "";
    this.urlRef.nativeElement.value = "";
  }


}
