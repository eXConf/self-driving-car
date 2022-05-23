import { Level, NeuralNetwork } from "./network.js";
import { getHSLA, lerp } from "./utils.js";

export class Visualizer {
  static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    Visualizer.drawLevel(
      ctx,
      network.levels[0],
      left,
      top,
      width,
      height,
    );
  }

  static drawLevel(
    ctx: CanvasRenderingContext2D,
    level: Level,
    left: number,
    top: number,
    width: number,
    height: number,
  ) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(
          Visualizer.#getNodeX(inputs, i, left, right), bottom,
        );
        ctx.lineTo(
          Visualizer.#getNodeX(outputs, j, left, right), top,
        );

        ctx.lineWidth = 2;
        ctx.strokeStyle = getHSLA(weights[i][j]);
        ctx.stroke();
      }
    }

    const nodeRadius = 18;

    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getHSLA(inputs[i]);
      ctx.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getHSLA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getHSLA(biases[i]);
      ctx.setLineDash([3,3]);
      ctx.stroke();
      ctx.setLineDash([]);

    }
  }

  static #getNodeX(
    nodes: number[], index: number, left: number, right: number
  ): number {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1),
    );
  }
}