export namespace LibraryStateActions {
  export class Login {
    static readonly type = 'Library.Login'

    constructor (public payload: { username: string }) {
    }
  }

  export class Logout {
    static readonly type = 'Library.Logout'
  }

  export class AddBook {
    static readonly type = 'Library.AddBook'
  }

  export class RemoveBooks {
    static readonly type = 'Library.RemoveBooks'

    constructor (public payload: { bookIds: string[] }) {
    }
  }

  export class BorrowBooks {
    static readonly type = 'Library.BorrowBooks'

    constructor (public payload: { bookIds: string[] }) {
    }
  }

  export class ReturnBooks {
    static readonly type = 'Library.ReturnBooks'

    constructor (public payload: { bookIds: string[] }) {
    }
  }

  export class BusinessError {
    static readonly type = 'Library.BusinessError'

    constructor (public payload: { message: string }) {
    }
  }
}
