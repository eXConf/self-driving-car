import { Road } from "./road.js";
import { Car } from "./car.js";
import { Visualizer } from "./visualizer.js";
import { NeuralNetwork } from "./network.js";

const carCanvas = document.getElementById('carCanvas') as HTMLCanvasElement;
carCanvas.width = 200;

const networkCanvas = document.getElementById('networkCanvas') as HTMLCanvasElement;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d') as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext('2d') as CanvasRenderingContext2D;

renderButtons();

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 250;
const cars = generateCars(N);
let bestCar = cars[0];

const lsBestBrain = localStorage.getItem('bestBrain');

if (lsBestBrain) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(lsBestBrain!);
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain!, 0.2);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, 'DUMMY', 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, 'DUMMY', 2),
]

animate();

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem('bestBrain');
}

function generateCars(N: number) {
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

  let alive = 0;

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);

    if (!cars[i].damaged) alive += 1;
  }

  bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)))!;

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

  carCtx.beginPath();
  carCtx.fillStyle = 'white';
  carCtx.textAlign = 'center';
  carCtx.textBaseline = 'middle';
  carCtx.strokeStyle = 'black';
  carCtx.font = '30px Arial';
  carCtx.fillText(alive.toString(), carCanvas.width/2, 20);
  carCtx.lineWidth = 0.6;
  carCtx.strokeText(alive.toString(), carCanvas.width/2, 20);

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