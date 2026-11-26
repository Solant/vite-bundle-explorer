import bar from './bar';
import { baz } from './baz';

export function foo() {
  return bar() + baz();
}
