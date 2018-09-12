import { Component, ChangeDetectorRef, Input, forwardRef } from '@angular/core';
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
  templateUrl: 'password.component.html'
})
export class PasswordComponent implements ControlValueAccessor {

  @Input() controlName: string;
  @Input() label: string;
  @Input() errors: IControlErrors;
  @Input() required: boolean;

  value: string;
  disabled = false;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) { }

  get controlErrors(): string[] {
    return this.errors && Object.keys(this.errors);
  }

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
