import { Component, Input, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { IFile } from './file.interface';

@Component({
  selector: 'app-file',
  templateUrl: 'file.component.html',
  styleUrls: [ 'file.component.scss' ]
})
export class FileComponent implements AfterViewInit {

  @ViewChild('fileInput') fileRef: ElementRef;

  @Input() label: string;

  @Output() select = new EventEmitter<IFile>();

  value: IFile;

  ngAfterViewInit(): void {
    this.fileRef.nativeElement.addEventListener('change', event => this.onFileSelected(event));
  }

  private onFileChange(value: IFile): void {
    this.value = value;
    this.select.emit(this.value);
  }

  private onFileSelected(event: any): void {
    const [ file ] = event.target.files;
    const reader = new FileReader();
    reader.onload = textFile => this.onFileChange({
      name: file.name,
      value: reader.result
    });
    reader.readAsText(file);
  }
}
