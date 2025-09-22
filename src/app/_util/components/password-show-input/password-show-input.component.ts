import { Component, Input, HostBinding, Optional, Self, OnDestroy, DoCheck } from '@angular/core';
import { ControlValueAccessor, NgControl, FormGroup, FormBuilder } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import {MatFormFieldControl} from "@angular/material/form-field";

@Component({
  selector: 'app-password-show-input',
  templateUrl: './password-show-input.component.html',
  styleUrls: ['./password-show-input.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: PasswordShowInputComponent
    }
  ]
})
export class PasswordShowInputComponent implements OnDestroy, DoCheck, ControlValueAccessor, MatFormFieldControl<string> {

  private _value = '';
  private _placeholder = '';
  private _required = false;
  private _disabled = false;

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused: boolean = false;
  errorState: boolean;
  controlType?: string;
  autofilled?: boolean;
  show: boolean = false;
  static nextId = 0;
  hide = true;
  @HostBinding() id = `password-input-${PasswordShowInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  @Input() label:string =" ";
  onChange: any = () => {};
  onTouch: any = () => {};

  @Input()
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    this._value = value;
    this.parts.setValue({ password: value });
    this.onChange(value);
    this.onTouch(value);
    this.stateChanges.next();
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  get empty(): boolean {
    return this.parts.value.password.length === 0;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(required: boolean) {
    this._required = required;
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  constructor(
    private fb: FormBuilder,
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.parts = fb.group({
      password: '',
    });
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  onFocusIn(): void {
    this.focused = true;
    this.stateChanges.next();
  }

  onFocusOut(): void {
    this.focused = false;
    this.input();
    this.stateChanges.next();
  }

  input() {
    this.writeValue(this.parts.get('password').value);
    this.onChange(this._value);
  }

  showPassword(): void {
    this.show = true;
  }

  hidePassword(): void {
    this.show = false;
  }

  tapPassword(): void {
    this.show = !this.show;
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {}

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }
}
