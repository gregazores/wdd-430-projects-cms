import { Component } from '@angular/core';

@Component({
  // selector: [cms-root] <div cms-root></div> => select by attribute or
  // selector: '.cms-root' <div class='cms-root'></div> => select by class
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';

  // we will no longer need these since we will be using angular's routing
  // see app.component.html
  // selectedFeature: string = "documents";
  // switchView(selectedFeature: string) {
  //   this.selectedFeature = selectedFeature;
  // }
}
