import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core'
import { from, of } from 'rxjs'
import { concatMap, delay, map, mergeMap, take, tap, toArray } from 'rxjs/operators'

@Component({
  selector: 'app-demo-2',
  templateUrl: 'demo2.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo2Component {
  message = ''

  constructor (private cd: ChangeDetectorRef) {
  }

  doDemo () {
    const username = 'bob'
    const maxFollowers = 3
    this.updateMessage('Fetching follower list')
    // Get a list of followers based on github username via promise based HTTP call
    from(fetch(`https://api.github.com/users/${username}/followers`)).pipe(
      // resolve fetch response as json() object (this is a promise!)
      concatMap(response => response.json()),
      // emit a value for each follower in the json response (one to many)
      concatMap(json => of(...json).pipe(take(maxFollowers))),

      // Now, for each follower, get his/her follower count via another HTTP call
      // Concurrently, up to 3 HTTP requests at a time...
      mergeMap(
        user => fetch(`https://api.github.com/users/${user.login}`),
        3
      ),

      // for each response, convert to JSON (promise function)
      concatMap(response => response.json()),
      tap(user => console.log(`User [${user.login}] has ${user.followers} follower(s)`)),

      // extract the follower count for each follower.
      map(({ followers }) => followers),

      // toArray() collects all emitted values until the upstream observable has no more value.
      // it then emits all the collected values as a SINGLE array value (many to one)
      toArray(),

      // map() operator performs an array reduce() to add up all values in the array
      // and emit the total follower count
      map(followers => followers.reduce((p, c) => p + c, 0))

      // subscribe() for the next value. When next() value comes, it will contain the
      // "total follower count"
    ).subscribe(
      followerCount => {
        this.updateMessage(`Followers of ${username} has ${followerCount} followers`)
      },
      // if something goes wrong...
      e => console.error(e)
    )
  }

  updateMessage (value: string) {
    this.message = value
    this.cd.markForCheck()
  }
}
