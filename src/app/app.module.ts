import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatListModule, MatSnackBarModule } from '@angular/material'
import { NgxsModule } from '@ngxs/store'
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin'
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin'
import { LibraryState } from '../demo3/Library.state'
import { Demo1Component } from '../demo1/demo1.component'
import { Demo2Component } from '../demo2/demo2.component'
import { Demo3Component } from '../demo3/demo3.component'

@NgModule({
  declarations: [
    AppComponent,
    Demo1Component,
    Demo2Component,
    Demo3Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    NgxsModule.forRoot([ LibraryState ]),
    // NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsStoragePluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
