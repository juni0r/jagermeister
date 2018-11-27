import $ from 'jquery';
import TweenMax from 'gsap';

$.fn.smoke = $.fn.smoke || function (method, ...args) {
  let smoke = this.data('smoke');

  if (!smoke) {
    smoke = new Smoke(this, method || {});
    this.data({ smoke });
    if (typeof method === 'object') return this;
  }

  if (!method) {
    return this;
  }

  if (method === 'self') {
    return smoke;
  }

  if (method === 'destroy') {
    return this.data('smoke', null).empty();
  }

  const target = Smoke.prototype[method];

  if (typeof target !== 'function') {
    throw new Error(`Unknown method '${method}' for smoke`);
  }

  return target.call(smoke, ...args);
};

export default class Smoke {
  constructor (el, {
    count = 10,
    rps = v => 180,
    ...cycle
  }) {
    this.el = el;
    this.count = count;
    this.rps = rps;
    this.cycle = {};

    Object.entries(cycle).forEach(([ key, fn ]) => {
      this.cycle[key] = i => fn(i / count);
    });

    for (let i = 0; i < count; i++) {
      $(`<div class="layer" data-rps="${this.rps(i / count)}">`)
        .css({ zIndex: i })
        .appendTo(this.el);
    }
    this.layers = this.el.children('.layer');

    TweenMax.staggerTo(this.layers, 0, { cycle: this.cycle });

    this.lastAnimationFrameAt = 0;
    this.animate = this.animate.bind(this);
    window.requestAnimationFrame(this.animate);
  }

  animate (timestamp) {
    const secondsElapsed = (timestamp - this.lastAnimationFrameAt) / 1000;
    this.layers.each((_i, layer) => {
      const rotated = parseFloat(layer.dataset.rps) * secondsElapsed;
      TweenMax.set(layer, { rotation: `+=${rotated}` });
    });
    this.lastAnimationFrameAt = timestamp;
    window.requestAnimationFrame(this.animate);
  }
}
