import { Road } from "./road.js";
import { Car } from "./car.js";
import { Visualizer } from "./visualizer.js";
import { NeuralNetwork } from "./network.js";
import { getRandomColor } from "./utils.js";
const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
renderButtons();
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 1000;
let cars = generateCars(N);
let bestCar = cars[0];
const lsBestBrain = localStorage.getItem('bestBrain');
if (lsBestBrain) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(lsBestBrain);
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2, getRandomColor()),
];
animate(0);
function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}
function discard() {
    localStorage.removeItem('bestBrain');
}
function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
    }
    return cars;
}
function animate(time) {
    cars = cars.filter(car => !car.shouldBeDeleted);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    let alive = 0;
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
    if (bestCar.y - traffic[traffic.length - 1].y < 1000) {
        addTrafficCar();
    }
    if (traffic[0].y - bestCar.y > 2000) {
        traffic.shift();
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
        if (!cars[i].damaged)
            alive += 1;
        const isFarBehind = cars[i].y - bestCar.y > 1000;
        if (cars[i].damaged || isFarBehind) {
            const car = cars[i];
            setTimeout(() => car.shouldBeDeleted = true, 2000);
        }
    }
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, true);
    carCtx.restore();
    if (bestCar.brain != undefined) {
        Visualizer.drawNetwork(networkCtx, bestCar.brain);
    }
    carCtx.beginPath();
    carCtx.fillStyle = 'white';
    carCtx.textAlign = 'center';
    carCtx.textBaseline = 'middle';
    carCtx.strokeStyle = 'black';
    carCtx.font = '26px Arial';
    const text = `${alive} | ${Math.floor(time / 1000)}s`;
    carCtx.fillText(text, carCanvas.width / 2, 20);
    carCtx.lineWidth = 0.6;
    carCtx.strokeText(text, carCanvas.width / 2, 20);
    requestAnimationFrame(animate);
}
function renderButtons() {
    const div = document.createElement('div');
    div.setAttribute('id', 'verticalButtons');
    const saveBtn = document.createElement('button');
    saveBtn.innerText = '💾';
    saveBtn.onclick = save;
    const discardBtn = document.createElement('button');
    discardBtn.innerText = '🗑';
    discardBtn.onclick = discard;
    div.appendChild(saveBtn);
    div.appendChild(discardBtn);
    carCanvas.after(div);
}
function addTrafficCar() {
    const randomOffset = Math.floor(Math.random() * (250 - 100)) + 100;
    const y = traffic[traffic.length - 1].y - randomOffset;
    const lane = getLane();
    const car1 = new Car(road.getLaneCenter(lane), y, 30, 50, 'DUMMY', 2, getRandomColor());
    traffic.push(car1);
    if (Math.floor(Math.random() * 100) > 75) {
        let otherLane = lane;
        while (otherLane === lane) {
            otherLane = getLane();
        }
        const car2 = new Car(road.getLaneCenter(otherLane), y, 30, 50, 'DUMMY', 2, getRandomColor());
        traffic.push(car2);
    }
}
function getLane() {
    return Math.floor(Math.random() * road.laneCount);
}
