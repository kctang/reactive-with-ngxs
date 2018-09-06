import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core'
import { BehaviorSubject, interval, Observable } from 'rxjs'
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store'
import { MatSelectionList, MatSnackBar } from '@angular/material'
import { tap } from 'rxjs/operators'
import { trigger } from '@angular/animations'
import { LibraryState } from './Library.state'
import { Book, LibraryStateModel } from './Library.state.model'
import { LibraryStateActions } from './Library.state.actions'
import { flyInOut, slideUpDown } from '../util/animations'

@Component({
  selector: 'app-demo3',
  templateUrl: './demo3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideUpDown', slideUpDown),
    trigger('flyInOut', flyInOut)
  ]
})
export class Demo3Component implements OnInit {
  @ViewChild('libraryBooks')
  libraryBooks: MatSelectionList

  @ViewChild('myBooks')
  myBooks: MatSelectionList

  @Select(LibraryState.username)
  username$: Observable<string>

  @Select(LibraryState.myBookCount)
  myBookCount$: Observable<number>

  @Select(LibraryState.libraryPageCount)
  libraryPageCount$: Observable<number>

  @Select(LibraryState.myBooks)
  myBooks$: Observable<Book[]>

  @Select(LibraryState.libraryBooks)
  libraryBooks$: Observable<Book[]>

  constructor (private store: Store, private actions$: Actions,
               private snackBar: MatSnackBar) {
  }

  ngOnInit (): void {
    // note: don't forget to unsubscribe when destroying component
    this.actions$.pipe(
      ofActionDispatched(LibraryStateActions.BusinessError),
      tap<LibraryStateActions.BusinessError>(action => {
        this.snackBar.open(action.payload.message, undefined, {
          duration: 1000
        })
      })
    ).subscribe()

/*
    this.store.select(state => {
      const library = state.library as LibraryStateModel
      return library.currentUser
    }).subscribe(
      value => console.log(value)
    )

    const librarySnapshot = this.store.snapshot().library as LibraryStateModel
    console.log(librarySnapshot.currentUser)
*/
  }

  doLogin (username: string) {
    this.store.dispatch(new LibraryStateActions.Login({ username }))
  }

  doLogout () {
    this.store.dispatch(new LibraryStateActions.Logout())
  }

  doAddBook () {
    this.store.dispatch(new LibraryStateActions.AddBook())
  }

  doReturnBooks () {
    this.store.dispatch(new LibraryStateActions.ReturnBooks({
      bookIds: this.myBooks.selectedOptions.selected
        .map(option => option.value)
    }))
  }

  doRemoveBooks () {
    this.store.dispatch(new LibraryStateActions.RemoveBooks({
      bookIds: this.selectedBookIds()
    }))
  }

  doBorrowBooks () {
    this.store.dispatch(new LibraryStateActions.BorrowBooks({
      bookIds: this.selectedBookIds()
    }))
  }

  private selectedBookIds () {
    return this.libraryBooks.selectedOptions.selected
      .filter(option => !option.disabled)
      .map(option => option.value)
  }
}
