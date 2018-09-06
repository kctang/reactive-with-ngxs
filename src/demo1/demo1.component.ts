import { Component, OnInit } from '@angular/core'
import { of } from 'rxjs'
import { concatMap, delay, tap } from 'rxjs/operators'

@Component({
  selector: 'app-demo-1',
  templateUrl: 'demo1.html',
})
export class Demo1Component implements OnInit {
  promiseValue = ''
  observableValue = ''

  ngOnInit () {
    this.demoSimple()
  }

  demoSimple () {
    // --- promise
    // 1. update UI when promise runs
    // 2. after 2 seconds, update the resolved value to UI
    // 3. start a new promise that will change value to upper
    //    case after 2 seconds.
    // 4. update UI with the new value
    new Promise<string>(resolve => {
      this.promiseValue = 'Promise is running...'
      setTimeout(() => resolve('Promise is done.'), 2000)
    }).then(value => {
      this.promiseValue = value
      new Promise<string>(resolve => {
        setTimeout(() => resolve(value.toUpperCase()), 2000)
      }).then(value => {
        this.promiseValue = value
      })
    })

    // --- observable
    // 1. Move a value (the initial message) through the observable chain.
    of('Observable is running').pipe(
      // 2. First tap() operator updates UI with value it receives.
      tap(value => this.observableValue = value),
      // 3. Wait for 2 seconds with delay().
      delay(2000),
      // 4. Perform some async task (resolve a promise value in this case).
      concatMap(value => {
        console.log(`concatMap() received a value [${value}]`)
        return Promise.resolve('Observable is done.')
      }),
      // 5. Update the value to UI.
      tap(value => this.observableValue = value),
      // 6. Wait another 2 seconds.
      delay(2000)
      // 7. Item 1-6 will not execute if subscribe() is not called.
      // 8. When we subscribe, we supply function that will be called when
      //    next value arrives. In this case, the value resolved by promise.
      // 9: The next() function update UI again.
    ).subscribe(val => {
      this.observableValue = val.toUpperCase()
    })
  }
}
