import { Component, ChangeDetectorRef, Input, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { IControlErrors } from '../form.interface';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
      multi: true,
    }
  ],
  selector: 'app-text',
  templateUrl: 'text.component.html',
  styleUrls: [ 'text.component.scss' ]
})
export class TextComponent implements ControlValueAccessor {

  @ViewChild('inputField', { read: ElementRef }) inputField: ElementRef;

  @Input() label: string;
  @Input() errors: IControlErrors;
  @Input() required: boolean;

  value: string;
  disabled = false;

  get controlErrors(): string[] {
    return this.errors && Object.keys(this.errors);
  }

  onChange(value: string): void {
    this.value = value;
    this.propagateChange(value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onFocusOut(): void {
    this.propagateTouch();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
