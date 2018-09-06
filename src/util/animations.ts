import { animate, state, style, transition } from '@angular/animations'

export const flyInOut = [
  state('in', style({ opacity: 1, transform: 'translateX(0)' })),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
    animate('0.3s ease-in')
  ]),
  transition('* => void', [
    animate('0.3s 0.1s ease-out', style({
      opacity: 0,
      transform: 'translateX(100%)'
    }))
  ])
]

export const slideUpDown = [
  state('in', style({ transform: 'translateX(0)' })),
  transition('void => *', [
    style({ transform: 'translateY(+100%)' }),
    animate(300)
  ]),
  transition('* => void', [
    animate(300, style({ transform: 'translateY(100%)' }))
  ])
]
