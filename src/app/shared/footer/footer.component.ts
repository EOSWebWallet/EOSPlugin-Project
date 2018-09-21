import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: [ 'footer.component.scss' ]
})
export class FooterComponent {

  @Input() title: string;

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
