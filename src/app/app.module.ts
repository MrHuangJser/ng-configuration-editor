import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularEditorLibModule } from '@ngx-pangu/core';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, AngularEditorLibModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
