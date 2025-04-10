export interface CheckInventory {
  id?: string;
  tagId: string;
  seriesPattern: string;
  warningSeries: number;
  numberOfPadding: number;
  startingSeries: number;
  endingSeries: number;
  currentSeries: number;
  isRepeating: boolean;
  isActive: boolean;
}
