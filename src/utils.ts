export type Point2D = {
  x: number;
  y: number;
}

export type Intersection = {
  x: number;
  y: number;
  offset: number;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function getIntersection(
  A: Point2D,
  B: Point2D,
  C: Point2D,
  D: Point2D,
): Intersection | null {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      }
    }
  }

  return null;
}

export function polysIntersect(
  poly1: Point2D[],
  poly2: Point2D[]
): boolean {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length],
      );
      if (touch) return true;

    }
  }
  return false;
}

export function getHSLA(value: number): string {
  const alpha = Math.abs(value);
  const hue = value < 0 ? 10 : 222;
  return `hsla(${hue}, 100%, 80%, ${alpha})`;
}