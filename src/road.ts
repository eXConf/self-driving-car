import { lerp, Point2D } from "./utils.js";



export class Road {
  x: number;
  width: number;
  laneCount: number;

  left: number;
  right: number;
  top: number;
  bottom: number;

  borders: Point2D[][];

  constructor(x: number, width: number, laneCount: number = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    const topLeft: Point2D = { x: this.left, y: this.top };
    const topRight: Point2D = { x: this.right, y: this.top };
    const bottomLeft: Point2D = { x: this.left, y: this.bottom };
    const bottomRight: Point2D = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex: number): number {
    laneIndex = Math.min(laneIndex, this.laneCount - 1);
    const laneWidth = this.width / this.laneCount;

    return this.left + laneWidth / 2 + laneIndex * laneWidth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(
        this.left,
        this.right,
        i / this.laneCount,
      );

      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach(border => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}