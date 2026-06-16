export interface SourceLocation {
  readonly line: number;
  readonly column: number;
}

export interface SourceFrame {
  readonly label: string;
  readonly location?: SourceLocation;
}
