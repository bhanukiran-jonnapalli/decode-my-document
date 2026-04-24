import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { DecoderStore } from '../../features/decoder/store/decoder.store';
import { UploadCard } from '../../features/decoder/components/upload-card/upload-card';
import { ResultPanel } from '../../features/decoder/components/result-panel/result-panel';
import { LoaderOverlay } from '../../shared/components/loader-overlay/loader-overlay';
import { ErrorDialog } from '../../shared/components/error-dialog/error-dialog';

@Component({
  selector: 'app-home',
  imports: [UploadCard, ResultPanel, LoaderOverlay, ErrorDialog],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly store = inject(DecoderStore);
  private readonly resultsEl = viewChild<ElementRef>('resultsRef');

  constructor() {
    effect(() => {
      if (this.store.hasResult()) {
        const el = this.resultsEl();
        setTimeout(() => el?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    });
  }

  protected onFileSelected(file: File): void {
    this.store.decode(file);
  }

  protected onRetry(): void {
    this.store.retry();
  }

  protected onChangeDocument(): void {
    this.store.reset();
  }

  protected onCloseError(): void {
    this.store.reset();
  }

  protected onDecodeAnother(): void {
    this.store.reset();
  }
}
