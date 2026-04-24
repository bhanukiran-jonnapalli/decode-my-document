import { Component, input, output, signal } from '@angular/core';
import { DecodeData } from '../../models/decoder.model';

@Component({
  selector: 'app-result-panel',
  templateUrl: './result-panel.html',
  styleUrl: './result-panel.scss',
})
export class ResultPanel {
  readonly data = input.required<DecodeData>();
  readonly decodeAnother = output<void>();

  protected readonly copiedSection = signal<string | null>(null);
  protected readonly expandedFlags = signal(false);
  protected readonly expandedQuestions = signal(false);
  protected readonly MAX_VISIBLE = 3;

  protected copyText(text: string, section: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedSection.set(section);
      setTimeout(() => this.copiedSection.set(null), 2000);
    });
  }

  protected copyList(items: string[], section: string): void {
    const text = items.map((item, i) => `${i + 1}. ${item}`).join('\n');
    this.copyText(text, section);
  }
}
