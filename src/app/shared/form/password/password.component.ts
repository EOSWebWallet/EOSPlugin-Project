import { Component, ChangeDetectorRef, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { IControlErrors } from '../form.interface';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordComponent),
      multi: true,
    }
  ],
  selector: 'app-password',
  templateUrl: 'password.component.html',
  styleUrls: [ 'password.component.scss' ]
})
export class PasswordComponent implements ControlValueAccessor {

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
