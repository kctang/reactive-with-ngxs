import { Action, Selector, State, StateContext } from '@ngxs/store'
import { tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { Book, LibraryStateModel } from './Library.state.model'
import { LibraryStateActions } from './Library.state.actions'

@State<LibraryStateModel>({
  name: 'library',
  defaults: {
    currentUser: 'guest',
    books: {},
    checkedOutBooks: {}
  }
})
export class LibraryState {
  @Selector()
  static username (state: LibraryStateModel) {
    return state.currentUser
  }

  @Selector()
  static libraryBooks (state: LibraryStateModel) {
    return Object.values(state.books).sort()
  }

  @Selector()
  static myBookCount (state: LibraryStateModel) {
    const myBooks = state.checkedOutBooks[ state.currentUser ] || []
    return myBooks.length
  }

  @Selector()
  static libraryPageCount (state: LibraryStateModel) {
    return Object.keys(state.books)
      .map(bookId => state.books[ bookId ])
      .reduce((p, c) => p + c.pages, 0)
  }

  @Selector()
  static myBooks (state: LibraryStateModel) {
    const bookIds = state.checkedOutBooks[ state.currentUser ] || []

    return Object.keys(state.books)
      .filter(bookId => bookIds.indexOf(bookId) !== -1)
      .map(bookId => state.books[ bookId ])
      .sort()
  }

  constructor (private http: HttpClient) {
  }

  @Action(LibraryStateActions.Login)
  login (context: StateContext<LibraryStateModel>, { payload }: LibraryStateActions.Login) {
    // reducer
    context.patchState({
      currentUser: payload.username
    })
  }

  @Action(LibraryStateActions.Logout)
  logout (context: StateContext<LibraryStateModel>) {
    // reducer
    context.patchState({
      currentUser: 'guest'
    })
  }

  @Action(LibraryStateActions.AddBook)
  addBook (context: StateContext<LibraryStateModel>) {
    // this is where redux solutions use middleware: effects, thunk, saga
    // in ngxs, return an observable
    return this.http.get('//uinames.com/api/?callback=callback').pipe(
      tap(({ name }: any) => {
        const newBook: Book = {
          id: `${Date.now()}`, // simple ID generator
          pages: (Date.now() % 200) + 1, // between 1 to 200
          title: name
        }
        context.patchState({
          books: {
            ...context.getState().books,
            [ newBook.id ]: newBook
          }
        })
      })
    )
  }

  @Action(LibraryStateActions.RemoveBooks)
  removeBooks (context: StateContext<LibraryStateModel>, { payload }: LibraryStateActions.RemoveBooks) {
    const books = context.getState().books
    payload.bookIds.map(bookId => {
      delete books[ bookId ]
    })

    context.patchState({ books })
  }

  @Action(LibraryStateActions.BorrowBooks)
  borrowBooks (context: StateContext<LibraryStateModel>, { payload }: LibraryStateActions.BorrowBooks) {
    const { currentUser, books, checkedOutBooks } = context.getState()

    if (currentUser === 'guest') {
      return context.dispatch(new LibraryStateActions.BusinessError({ message: 'Guest not allowed to borrow books.' }))
    }

    // update borrower
    payload.bookIds.map(bookId => {
      books[ bookId ].borrower = currentUser
    })

    // update user's borrowed book
    const userCheckedOutBooks = new Set(checkedOutBooks[ currentUser ] || [])
    payload.bookIds.map(bookId => userCheckedOutBooks.add(bookId))

    context.patchState({
      books,
      checkedOutBooks: {
        ...checkedOutBooks,
        [ currentUser ]: Array.from(userCheckedOutBooks)
      }
    })
  }

  @Action(LibraryStateActions.ReturnBooks)
  returnBooks (context: StateContext<LibraryStateModel>, { payload }: LibraryStateActions.ReturnBooks) {
    const { currentUser, books, checkedOutBooks } = context.getState()

    // update borrower
    payload.bookIds.map(bookId => {
      books[ bookId ].borrower = undefined
    })

    // update user's borrowed book
    const userCheckedOutBooks = new Set(context.getState().checkedOutBooks[ currentUser ])
    payload.bookIds.map(bookId => userCheckedOutBooks.delete(bookId))

    context.patchState({
      books,
      checkedOutBooks: {
        ...checkedOutBooks,
        [ currentUser ]: Array.from(userCheckedOutBooks)
      }
    })
  }
}
