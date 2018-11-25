import $ from 'jquery';
import TweenMax, { TimelineMax as Timeline, Linear, Expo } from 'gsap';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js';
import { Ease, LayerGenerator, Range } from 'src/smoke';

window.$ = $;
window.Timeline = Timeline;
window.Tween = TweenMax;
window.Expo = Expo;

$(() => {
  const smoke = setupSmoke();

  const frost1 = $('#frost-1');
  const frost2 = $('#frost-2');

  smoke.css({ opacity: 0 });
  frost1.css({ opacity: 0 });
  frost2.css({ opacity: 0 });

  const freeze = new Timeline({ paused: false });

  freeze.to(smoke, 0, { opacity: 1 });
  freeze.to(frost2, 1.5, { opacity: 0.67, ease: Linear.easeOut });
  freeze.staggerFrom($('#smoke .layer'), 1, { x: 20, y: '-=50', opacity: 0, ease: Linear.easeOut }, 0.025, '-=1.5');

  const chill = new Timeline({ paused: false });

  chill.to(frost1, 1, { opacity: 1, ease: Linear.easeInOut });

  var duration = 800;

  addScene('#ease-start', {
    pin: '#hero-stage',
    duration,
    tween: chill
  });

  addScene('#freeze-keep', {
    pin: '#hero-stage',
    duration,
    offset: duration
  });

  addScene('#freeze-start', {
    offset: duration,
    tween: freeze
  });
});

const debugScrollMagic = false;
const controller = new ScrollMagic.Controller();

function addScene (triggerElement, { duration = 0, offset = 0, triggerHook = 'onLeave', tween, pin }) {
  const scene = new ScrollMagic.Scene({ triggerElement, triggerHook, duration, offset });
  if (pin) scene.setPin(pin);
  if (tween) scene.setTween(tween);
  if (debugScrollMagic) scene.addIndicators({ name: triggerElement });
  scene.addTo(controller);
  return scene;
}

function setupSmoke () {
  const smoke = $('#smoke').smoke();

  const scale = Ease(2).in;

  const layerCount = 25;

  const xFrom = 80;
  const xTo = 120;
  const xJitter = 0;

  const rpsFrom = 30;
  const rpsTo = -20;

  let generator;

  generator = new LayerGenerator({
    x: Range({ from: xFrom, to: xTo, jitter: xJitter, scale }),
    y: Range({ from: 0, to: 700, jitter: 20, scale }),
    opacity: Range({ from: 1, to: 0, scale }),
    scale: Range({ from: 0.15, to: 0.5, scale }),
    rps: Range({ from: rpsFrom, to: rpsTo, scale }),
    zIndex: Range({ from: 999, to: 1999, scale }),
    rotation: () => (Math.random() * 360)
  });

  const layers = [];

  generator.make(layerCount, layers);

  generator.ranges.x = Range({ from: -xFrom, to: -xTo, jitter: xJitter, scale });
  generator.ranges.rps = Range({ from: -rpsFrom, to: -rpsTo, scale });
  generator.make(layerCount, layers);

  smoke.smoke('load', layers.sort((a, b) => a.zIndex - b.zIndex));

  return smoke;
}
