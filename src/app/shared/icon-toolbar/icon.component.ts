import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-icon',
  templateUrl: 'icon.component.html',
  styleUrls: [ 'icon.component.scss' ]
})
export class ToolbarIconComponent {
  @Input() type: string;
}
