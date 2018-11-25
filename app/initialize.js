import $ from 'jquery';
import TweenMax, { TimelineMax as Timeline, Linear, Quad, Expo } from 'gsap';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js';
import { LayerGenerator, Range } from 'src/smoke';

window.$ = $;
window.Timeline = Timeline;
window.Tween = TweenMax;
window.Quad = Quad;
window.Expo = Expo;

$(() => {
  const smoke = setupSmoke('#smoke');
  const frost1 = '#frost-1';
  const frost2 = '#frost-2';

  TweenMax.set([ smoke, frost1, frost2 ], { opacity: 0 });

  const chill = TweenMax.to(frost1, 1, { opacity: 0.67, ease: Linear.easeInOut });

  const freeze = new Timeline({ paused: false })
    .to(smoke, 0, { opacity: 1 })
    .to(frost2, 1.5, { opacity: 1, ease: Quad.easeOut })
    .staggerFrom('#smoke >.layer', 2, { x: 0, y: '-=100', opacity: 0, ease: Quad.easeOut }, 0.05, '-=2');

  addScene('#ease-start', {
    pin: '#hero-stage',
    duration: 800,
    tween: chill
  });

  addScene('#freeze-keep', {
    pin: '#hero-stage',
    duration: 800,
    offset: 800
  });

  addScene('#freeze-start', {
    offset: 800,
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

function setupSmoke (selector) {
  const smoke = $(selector).smoke();

  const layers = [];

  const layerCount = 50;

  const xFrom = 80;
  const xTo = 120;

  const rpsFrom = 30;
  const rpsTo = 0;

  const ease = Quad.easeIn.getRatio;

  let generator = new LayerGenerator({
    x: Range({ from: xFrom, to: xTo, ease }),
    y: Range({ from: 0, to: 700, ease }),
    opacity: Range({ from: 1, to: 0, ease }),
    scale: Range({ from: 0.15, to: 0.5, ease }),
    rps: Range({ from: rpsFrom, to: rpsTo, ease }),
    zIndex: Range({ from: 0, to: 999, ease }),
    rotation: () => (Math.random() * 360)
  });

  generator.make(layerCount / 2, layers);

  generator.ranges.x = Range({ from: -xFrom, to: -xTo, ease });
  generator.ranges.rps = Range({ from: -rpsFrom, to: -rpsTo, ease });

  generator.make(layerCount / 2, layers);

  layers.sort((a, b) => a.zIndex - b.zIndex)

  smoke.smoke('load', layers);

  return smoke;
}
