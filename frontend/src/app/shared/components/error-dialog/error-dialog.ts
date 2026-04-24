import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.scss',
})
export class ErrorDialog {
  readonly message = input.required<string>();
  readonly retry = output<void>();
  readonly changeDocument = output<void>();
  readonly close = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
