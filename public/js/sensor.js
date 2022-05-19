var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Sensor_instances, _Sensor_getReading, _Sensor_castRays;
import { getIntersection, lerp } from "./utils.js";
export class Sensor {
    constructor(car) {
        _Sensor_instances.add(this);
        this.car = car;
        this.rayCount = 3;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;
        this.rays = [];
        this.readings = [];
    }
    update(roadBorders) {
        __classPrivateFieldGet(this, _Sensor_instances, "m", _Sensor_castRays).call(this);
        this.readings = [];
        for (let i = 0; i < this.rays.length; i++) {
            const reading = __classPrivateFieldGet(this, _Sensor_instances, "m", _Sensor_getReading).call(this, this.rays[i], roadBorders);
            // if (reading) {
            //   this.readings.push(reading);
            // }
            this.readings.push(reading);
        }
    }
    draw(ctx) {
        for (let i = 0; i < this.rayCount; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'yellow';
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}
_Sensor_instances = new WeakSet(), _Sensor_getReading = function _Sensor_getReading(ray, roadBoarders) {
    let touches = [];
    for (let i = 0; i < roadBoarders.length; i++) {
        const touch = getIntersection(ray[0], ray[1], roadBoarders[i][0], roadBoarders[i][1]);
        if (touch) {
            touches.push(touch);
        }
    }
    if (touches.length === 0) {
        return null;
    }
    else {
        const offsets = touches.map(el => el.offset);
        const minOffset = Math.min(...offsets);
        return touches.find(el => el.offset === minOffset);
    }
}, _Sensor_castRays = function _Sensor_castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
        const rayAngle = lerp(this.raySpread / 2, -this.raySpread / 2, this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)) + this.car.angle;
        const start = { x: this.car.x, y: this.car.y };
        const end = {
            x: this.car.x - Math.sin(rayAngle) * this.rayLength,
            y: this.car.y - Math.cos(rayAngle) * this.rayLength,
        };
        this.rays.push([start, end]);
    }
};
