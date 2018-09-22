import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: 'button.component.html',
  styleUrls: [ 'button.component.scss' ]
})
export class ButtonComponent {

  @Input() type: string;
  @Input() label: string;
  @Input() disabled: boolean;

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      event.stopPropagation();
    }
  }
}
