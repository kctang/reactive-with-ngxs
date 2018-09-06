export interface Book {
  id: string
  title: string
  pages: number
  borrower?: string
}

export interface LibraryStateModel {
  currentUser: string
  books: {
    [ id: string ]: Book
  }
  checkedOutBooks: {
    [ username: string ]: string[]
  }
}
