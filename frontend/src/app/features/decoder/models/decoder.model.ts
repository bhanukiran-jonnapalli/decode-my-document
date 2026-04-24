export interface DecodeData {
  summary: string;
  redFlags: string[];
  questions: string[];
}

export interface DecodeResponse {
  success: boolean;
  data: DecodeData;
}
