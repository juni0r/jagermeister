import $ from 'jquery';
import TweenMax from 'gsap';

export default class Smoke {
  constructor (el, props) {
    Object.assign(this, props);
    this.el = el;
    this.layers = [];
    this.lastAnimationFrameAt = 0;
    this.animate = this.animate.bind(this);
    window.requestAnimationFrame(this.animate);
  }

  addLayer (props) {
    const layer = new Layer(props);
    this.layers.push(layer);
    layer.appendTo(this.el);
    return layer;
  }

  removeLayerAt (index) {
    const layer = this.layerAt(index);
    this.layers = this.layers.slice(0, index).concat(this.layers.slice(index + 1));
    layer.remove();
    return layer;
  }

  layerAt (index) {
    return this.layers[index];
  }

  removeAllLayers () {
    this.layers.forEach(layer => layer.remove());
    this.layers = [];
  }

  load (layers) {
    layers.forEach(layer => this.addLayer(layer));
  }

  animate (timestamp) {
    const timeElapsed = timestamp - this.lastAnimationFrameAt;
    this.layers.forEach(layer => layer.advance(timeElapsed));
    this.lastAnimationFrameAt = timestamp;
    window.requestAnimationFrame(this.animate);
  }
}

export class Layer {
  constructor (props) {
    Object.assign(this, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rps: 180,
      opacity: 1
    }, props);

    this.el = $('<div class="layer">');

    TweenMax.set(this.el, {
      x: this.x,
      y: this.y,
      scale: this.scale,
      rotation: this.rotation,
      opacity: this.opacity,
      zIndex: this.zIndex
    })
  }

  remove () {
    this.el.remove();
  }

  appendTo (el) {
    this.el.appendTo(el);
  }

  advance (timeElapsed) {
    this.rotation = (this.rotation + (this.rps * timeElapsed / 1000)) % 360;
    TweenMax.set(this.el, { rotation: this.rotation });
  }
}

export const Linear = x => x;

export function Range ({ from, to, scale = Linear }) {
  const range = to - from;
  return value => from + (range * scale(value));
}

export class LayerGenerator {
  constructor (ranges) {
    this.ranges = ranges;
  }

  get (value) {
    const variant = {};
    // Object.keys(this.ranges).forEach((key) => { variant[key] = this.ranges[key](value) });
    Object.entries(this.ranges).forEach(([key, range]) => {
      variant[key] = range(value);
    });
    return variant;
  }

  make (n, objects = []) {
    for (let i = 0; i < n; i++) {
      objects.push(this.get(i / n));
    }
    return objects;
  }
}

$.fn.smoke = $.fn.smoke || function (method, ...args) {
  let smoke = this.data('smoke');

  if (!smoke) {
    smoke = new Smoke(this);
    this.data({ smoke });
  }

  if (!method) {
    return this;
  }

  if (method === 'self') {
    return smoke;
  }

  if (method === 'destroy') {
    smoke.removeAllLayers();
    this.data('smoke', null);
    return this;
  }

  const target = Smoke.prototype[method];

  if (typeof target !== 'function') {
    throw new Error(`Unknown method '${method}' for smoke`);
  }

  return target.call(smoke, ...args);
};
