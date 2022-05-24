var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Visualizer_getNodeX;
import { getHSLA, lerp } from "./utils.js";
export class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;
        const levelHeight = height / network.levels.length;
        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top +
                lerp(height - levelHeight, 0, network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1));
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i == network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : []);
        }
    }
    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;
        const { inputs, outputs, weights, biases } = level;
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(__classPrivateFieldGet(Visualizer, _a, "m", _Visualizer_getNodeX).call(Visualizer, inputs, i, left, right), bottom);
                ctx.lineTo(__classPrivateFieldGet(Visualizer, _a, "m", _Visualizer_getNodeX).call(Visualizer, outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getHSLA(weights[i][j]);
                ctx.stroke();
            }
        }
        const nodeRadius = 18;
        for (let i = 0; i < inputs.length; i++) {
            const x = __classPrivateFieldGet(Visualizer, _a, "m", _Visualizer_getNodeX).call(Visualizer, inputs, i, left, right);
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
            const x = __classPrivateFieldGet(Visualizer, _a, "m", _Visualizer_getNodeX).call(Visualizer, outputs, i, left, right);
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
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'yellow';
                ctx.strokeStyle = 'black';
                ctx.font = (nodeRadius * 1.0) + 'px Arial';
                ctx.fillText(outputLabels[i], x, top);
                ctx.lineWidth = 1;
                ctx.strokeText(outputLabels[i], x, top);
            }
        }
    }
}
_a = Visualizer, _Visualizer_getNodeX = function _Visualizer_getNodeX(nodes, index, left, right) {
    return lerp(left, right, nodes.length == 1 ? 0.5 : index / (nodes.length - 1));
};
