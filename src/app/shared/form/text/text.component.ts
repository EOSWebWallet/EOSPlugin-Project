import { Component, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
      multi: true,
    }
  ],
  selector: 'app-text',
  templateUrl: 'text.component.html'
})
export class TextComponent implements ControlValueAccessor {

  @Input() label: string;

  value: string;
  disabled = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  onChange(value: string): void {
    this.value = value;
    this.propagateChange(value);
  }

  writeValue(value: string): void {
    this.value = value;
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cdRef.markForCheck();
  }

  onFocusOut(): void {
    this.propagateTouch();
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
