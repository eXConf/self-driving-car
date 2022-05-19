import { Car } from "./car.js";
import { getIntersection, Intersection, lerp, Point2D } from "./utils.js";

export class Sensor {
  car: Car;
  rayCount: number;
  rayLength: number;
  raySpread: number;

  rays: Point2D[][];
  readings: (Intersection | null)[];

  constructor(car: Car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders: Point2D[][]) {
    this.#castRays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      const reading = this.#getReading(this.rays[i], roadBorders);
      // if (reading) {
      //   this.readings.push(reading);
      // }
      this.readings.push(reading);
    }
  }

  #getReading(ray: Point2D[], roadBoarders: Point2D[][]): Intersection | null {
    let touches: Intersection[] = [];

    for (let i = 0; i < roadBoarders.length; i++) {
      const touch: Intersection | null = getIntersection(
        ray[0],
        ray[1],
        roadBoarders[i][0],
        roadBoarders[i][1],
      );

      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map(el => el.offset);
      const minOffset = Math.min(...offsets);

      return touches.find(el => el.offset === minOffset) as Intersection;
    }
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1),
      ) + this.car.angle;

      const start: Point2D = { x: this.car.x, y: this.car.y };
      const end: Point2D = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }

      this.rays.push([start, end]);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i] as Point2D;
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'yellow';
      ctx.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y,
      );
      ctx.lineTo(
        end.x,
        end.y,
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.moveTo(
        this.rays[i][1].x,
        this.rays[i][1].y,
      );
      ctx.lineTo(
        end.x,
        end.y,
      );
      ctx.stroke();
    }
  }
}