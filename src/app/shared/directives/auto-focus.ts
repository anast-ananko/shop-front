import { afterNextRender, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocus {
  private el = inject(ElementRef<HTMLInputElement>);

  constructor() {
    afterNextRender(() => {
      this.el.nativeElement.focus();
    });
  }


}
