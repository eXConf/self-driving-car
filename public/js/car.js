var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Car_instances, _Car_assessDamage, _Car_createPolygon, _Car_move;
import { Controls } from "./controls.js";
import { NeuralNetwork } from "./network.js";
import { Sensor } from "./sensor.js";
import { polysIntersect } from "./utils.js";
export class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3, color = 'rgb(78,147,244)') {
        _Car_instances.add(this);
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
            this.brain = new NeuralNetwork([this.sensor.rayCount, 10, 8, 6, 4]);
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
            };
        }
        this.polygon = [];
    }
    update(roadBorders, traffic) {
        if (!this.damaged) {
            __classPrivateFieldGet(this, _Car_instances, "m", _Car_move).call(this);
            this.polygon = __classPrivateFieldGet(this, _Car_instances, "m", _Car_createPolygon).call(this);
            this.damaged = __classPrivateFieldGet(this, _Car_instances, "m", _Car_assessDamage).call(this, roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => {
                return s == null ? 0 : 1 - s.offset;
            });
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            if (this.useBrain) {
                this.controls.forward = Boolean(outputs[0]);
                this.controls.left = Boolean(outputs[1]);
                this.controls.right = Boolean(outputs[2]);
                this.controls.reverse = Boolean(outputs[3]);
            }
        }
    }
    draw(ctx, drawSensor = false) {
        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        if (!this.damaged) {
            ctx.drawImage(this.mask, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.globalCompositeOperation = 'multiply';
        }
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
_Car_instances = new WeakSet(), _Car_assessDamage = function _Car_assessDamage(roadBorders, traffic) {
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
}, _Car_createPolygon = function _Car_createPolygon() {
    const points = [];
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
}, _Car_move = function _Car_move() {
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
