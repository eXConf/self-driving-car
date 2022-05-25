import { Controls } from "./controls.js";
import { NeuralNetwork } from "./network.js";
import { Sensor } from "./sensor.js";
import { Point2D, polysIntersect } from "./utils.js";

export class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controlType: string;
  brain: NeuralNetwork | undefined;

  speed: number;
  maxSpeed: number;
  friction: number;
  acceleration: number;
  angle: number;
  steerSpeed: number;
  damaged: boolean;
  shouldBeDeleted: boolean;

  useBrain: boolean;

  sensor: Sensor | undefined;
  controls: Controls;
  img: HTMLImageElement;
  color: string;
  mask: HTMLCanvasElement;

  polygon: Point2D[];

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: string,
    maxSpeed = 3,
    color = 'rgb(78,147,244)',
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controlType = controlType;

    this.speed = 0;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.acceleration = 0.25;
    this.angle = 0;
    this.steerSpeed = 0.06;
    this.damaged = false;
    this.shouldBeDeleted = false;
    this.useBrain = controlType == 'AI';

    if (controlType != 'DUMMY') {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork(
        [this.sensor.rayCount, 10, 8, 6, 4]
      );
    }
    this.controls = new Controls(controlType);

    this.img = new Image();
    this.img.src = 'img/car.png';
    this.color = color;

    this.mask = document.createElement('canvas');
    this.mask.width = width;
    this.mask.height = height;

    const maskCtx = this.mask.getContext('2d');
    if (maskCtx) {
      this.img.onload = () => {
        maskCtx.fillStyle = color;
        maskCtx.rect(0, 0, this.width, this.height);
        maskCtx.fill();

        maskCtx.globalCompositeOperation = 'destination-atop';
        maskCtx.drawImage(this.img, 0, 0, this.width, this.height);

      }
    }

    this.polygon = [];
  }

  update(roadBorders: Point2D[][], traffic: Car[]) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(s => {
        return s == null ? 0 : 1 - s.offset;
      });
      const outputs = NeuralNetwork.feedForward(
        offsets, this.brain as NeuralNetwork
      );

      if (this.useBrain) {
        this.controls.forward = Boolean(outputs[0]);
        this.controls.left = Boolean(outputs[1]);
        this.controls.right = Boolean(outputs[2]);
        this.controls.reverse = Boolean(outputs[3]);
      }
    }
  }

  #assessDamage(roadBorders: Point2D[][], traffic: Car[]): boolean {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon(): Point2D[] {
    const points: Point2D[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += this.steerSpeed * flip;
      }
      if (this.controls.right) {
        this.angle -= this.steerSpeed * flip;
      }
    }


    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    drawSensor: boolean = false
  ) {
    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    if (!this.damaged) {
      ctx.drawImage(this.mask,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.globalCompositeOperation = 'multiply';
    }
    ctx.drawImage(this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();

  }
}