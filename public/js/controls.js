var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Controls_instances, _Controls_addKeyboardListeners;
export class Controls {
    constructor(type) {
        _Controls_instances.add(this);
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;
        switch (type) {
            case 'KEYS':
                __classPrivateFieldGet(this, _Controls_instances, "m", _Controls_addKeyboardListeners).call(this);
                break;
            case 'DUMMY':
                this.forward = true;
                break;
            default:
                break;
        }
    }
}
_Controls_instances = new WeakSet(), _Controls_addKeyboardListeners = function _Controls_addKeyboardListeners() {
    document.onkeydown = event => {
        switch (event.key) {
            case 'ArrowLeft':
                this.left = true;
                break;
            case 'ArrowRight':
                this.right = true;
                break;
            case 'ArrowUp':
                this.forward = true;
                break;
            case 'ArrowDown':
                this.reverse = true;
                break;
        }
    };
    document.onkeyup = event => {
        switch (event.key) {
            case 'ArrowLeft':
                this.left = false;
                break;
            case 'ArrowRight':
                this.right = false;
                break;
            case 'ArrowUp':
                this.forward = false;
                break;
            case 'ArrowDown':
                this.reverse = false;
                break;
        }
    };
};
