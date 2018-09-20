import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: 'icon.component.html',
  styleUrls: [ 'icon.component.scss' ]
})
export class IconComponent {
  @Input()
  type: string;

  get showDefaultIcon(): boolean {
    return !this.type.startsWith('icon');
  }
}
