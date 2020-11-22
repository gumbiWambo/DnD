import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'dnd-list-class',
  templateUrl: './list-class.component.html',
  styleUrls: ['./list-class.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListClassComponent),
      multi: true
    }
  ]
})
export class ListClassComponent implements OnInit, ControlValueAccessor {
  private _value: any;
  @Input() classList: string[] = [];
  @Input() valueList: string[] = [];

  public onChange: any = () => {};
  public onTouch: any = () => {};
  public inputValue = '';
  public selectedClass = '';
  public selectedValues = [];

  public set value(newValue) {
    this._value =  newValue
    this.onChange(newValue);
    this.onTouch(newValue);
  }
  public get value() {
    return this._value;
  }

  constructor(private classService: ClassService) {
    this.classService.class.subscribe(x => {
      this.classList = x;
    });
  }

  ngOnInit(): void {

  }

  public addToValue(input: string) {
    this.selectedValues.push(input);
    this.value = {
      class: this.selectedClass,
      values: this.selectedValues
    };
  }

//#region valueAccessor 
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  writeValue(newValue) {
    this.value = newValue;
  }

  setDisabledState() {
  }

//#endregion valueAccessor
}
