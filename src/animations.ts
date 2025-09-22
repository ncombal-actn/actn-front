import {
  animation, trigger, animateChild, group,
  transition, animate, style, query
} from '@angular/animations';

export const expandVertical = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}')
]);
