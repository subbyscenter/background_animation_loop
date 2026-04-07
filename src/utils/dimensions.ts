export function getExportDimensions(aspectRatio: string, resolution: number) {
  if (aspectRatio === '16:9') {
    return { width: Math.round(resolution * (16 / 9)), height: resolution };
  } else if (aspectRatio === '9:16') {
    return { width: resolution, height: Math.round(resolution * (16 / 9)) };
  } else { // 1:1
    return { width: resolution, height: resolution };
  }
}
