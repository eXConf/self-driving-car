var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Car_instances, _Car_move;
import { Controls } from "./controls.js";
import { Sensor } from "./sensor.js";
export class Car {
    constructor(x, y, width, height) {
        _Car_instances.add(this);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
        this.maxSpeed = 6;
        this.friction = 0.05;
        this.acceleration = 0.5;
        this.angle = 0;
        this.steerSpeed = 0.06;
        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }
    update(roadBorders) {
        __classPrivateFieldGet(this, _Car_instances, "m", _Car_move).call(this);
        this.sensor.update(roadBorders);
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fill();
        ctx.restore();
        this.sensor.draw(ctx);
    }
}
_Car_instances = new WeakSet(), _Car_move = function _Car_move() {
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
};
