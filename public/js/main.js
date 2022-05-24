import { Road } from "./road.js";
import { Car } from "./car.js";
import { Visualizer } from "./visualizer.js";
const carCanvas = document.getElementById('carCanvas');
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.width = 300;
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
renderButtons();
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
const lsBestBrain = localStorage.getItem('bestBrain');
if (lsBestBrain) {
    bestCar.brain = JSON.parse(lsBestBrain);
}
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
];
animate();
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
function animate() {
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, 'red');
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'blue');
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);
    carCtx.restore();
    if (bestCar.brain != undefined) {
        Visualizer.drawNetwork(networkCtx, bestCar.brain);
    }
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
