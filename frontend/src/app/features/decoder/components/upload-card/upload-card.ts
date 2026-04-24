import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-upload-card',
  templateUrl: './upload-card.html',
  styleUrl: './upload-card.scss',
})
export class UploadCard {
  readonly fileSelected = output<File>();

  protected readonly isDragging = signal(false);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly fileError = signal<string | null>(null);

  private dragCounter = 0;

  protected onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter++;
    this.isDragging.set(true);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter--;
    if (this.dragCounter <= 0) {
      this.dragCounter = 0;
      this.isDragging.set(false);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragCounter = 0;
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    this.fileError.set(null);
    if (file.type !== 'application/pdf') {
      this.fileError.set('Only PDF files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.fileError.set('File size must be under 5MB.');
      return;
    }
    this.selectedFile.set(file);
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected submit(): void {
    const file = this.selectedFile();
    if (file) this.fileSelected.emit(file);
  }

  protected clearFile(): void {
    this.selectedFile.set(null);
    this.fileError.set(null);
  }
}
