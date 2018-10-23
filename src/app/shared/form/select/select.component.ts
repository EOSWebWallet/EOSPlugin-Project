import { Component, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

import { IControlErrors } from '../form.interface';
import { ISelectOption } from './select.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: [ './select.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() errors: IControlErrors;
  @Input() options: ISelectOption[];
  @Input() multiple: boolean;
  @Input() required: boolean;

  @Output() select = new EventEmitter<ISelectOption | ISelectOption[]>();

  value: string | string[];

  get isLoading(): boolean {
    return this.options === null;
  }

  writeValue(value: ISelectOption | ISelectOption[]): void {
    if (value) {
      this.value = Array.isArray(value)
        ? value.map(o => o.value)
        : value.value;
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouched = fn;
  }

  onSelect(event: MatSelectChange): void {
    this.value = event.value;
    const options = Array.isArray(event.value)
      ? this.options.filter(o => event.value.includes(o.value))
      : this.options.find(o => o.value === this.value);
    this.propagateChange(options);
    this.select.emit(options);
  }

  private propagateTouched: Function = () => {};

  private propagateChange: Function = () => {};
}
