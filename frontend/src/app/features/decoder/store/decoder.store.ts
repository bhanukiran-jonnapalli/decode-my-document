import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecodeData, DecodeResponse } from '../models/decoder.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DecoderStore {
  private readonly http = inject(HttpClient);

  readonly loading = signal(false);
  readonly result = signal<DecodeData | null>(null);
  readonly error = signal<string | null>(null);
  readonly lastFile = signal<File | null>(null);

  readonly hasResult = computed(() => !!this.result());
  readonly isIdle = computed(() => !this.loading() && !this.result() && !this.error());
  readonly hasError = computed(() => !!this.error());

  decode(file: File): void {
    this.lastFile.set(file);
    this.loading.set(true);
    this.result.set(null);
    this.error.set(null);

    const formData = new FormData();
    formData.append('document', file);

    this.http
      .post<DecodeResponse>(`${environment.apiUrl}/api/decode`, formData)
      .subscribe({
        next: (res) => {
          this.result.set(res.data);
          this.loading.set(false);
        },
        error: (err) => {
          const message = err?.error?.error ?? 'Something went wrong. Please try again.';
          this.error.set(message);
          this.loading.set(false);
        },
      });
  }

  retry(): void {
    const file = this.lastFile();
    if (file) this.decode(file);
  }

  reset(): void {
    this.result.set(null);
    this.error.set(null);
    this.lastFile.set(null);
    this.loading.set(false);
  }
}
