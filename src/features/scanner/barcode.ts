export function normalizeScannedBarcode(data: string): string | null {
  return data.trim() || null;
}

export function barcodeFromParam(value: string | string[] | undefined): string {
  const first = Array.isArray(value) ? value[0] : value;
  return first?.trim() ?? '';
}
