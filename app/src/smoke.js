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

function pct (value) {
  return `${value * 100}%`;
}

function relativize (el, ref) {
  const width = ref.outerWidth();
  const height = ref.outerHeight();
  const position = el.position();
  return {
    left: position.left / width,
    top: position.top / height,
    width: el.outerWidth() / width,
    height: el.outerHeight() / height
  }
}

function scaleValues (base, range, scale) {
  const values = {};
  Object.keys(base).forEach(key => { values[key] = pct(base[key] + scale * range[key]) });
  return values;
}

function difference (a, b) {
  const diff = {}
  Object.keys(a).forEach(key => { diff[key] = a[key] - b[key] })
  return diff;
}

export default class Smoke {
  constructor (el, {
    count = 15,
    rps = v => 180,
    zIndex = 1,
    ease = x => x * x
  }) {
    const start = relativize($('.smoke-start', el), el);
    const end = relativize($('.smoke-end', el), el);

    const range = difference(end, start);

    for (let i = 0; i < count; i++) {
      const scale = ease(i / count);
      const css = Object.assign(scaleValues(start, range, scale), {
        zIndex: zIndex + i,
        opacity: 1 - scale * 0.8 + 0.2,
        transform: `rotate(${Math.random()}turn)`
      });

      $(`<div class="layer" data-rps="${rps(scale)}">`)
        .appendTo(el)
        .css(css);
    }
    this.layers = el.children('.layer');

    this.skippedAnimationFrames = 0;
    this.lastAnimationFrameAt = 0;
    this.animate = this.animate.bind(this);
    window.requestAnimationFrame(this.animate);
  }

  animate (timestamp) {
    this.skippedAnimationFrames++;
    if (this.skippedAnimationFrames === 3) {
      this.skippedAnimationFrames = 0;
      const secondsElapsed = (timestamp - this.lastAnimationFrameAt) / 1000;
      this.layers.each((_i, layer) => {
        const rotated = parseFloat(layer.dataset.rps) * secondsElapsed;
        TweenMax.set(layer, { rotation: `+=${rotated}` });
      });
      this.lastAnimationFrameAt = timestamp;
    }
    window.requestAnimationFrame(this.animate);
  }
}
