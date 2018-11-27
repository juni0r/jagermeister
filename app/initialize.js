import $ from 'jquery';
import TweenMax, { TimelineMax as Timeline, Linear, Quad, Expo, Cubic } from 'gsap';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js';
import 'src/smoke';

window.$ = $;
window.Timeline = Timeline;
window.Tween = TweenMax;
window.Quad = Quad;
window.Expo = Expo;

function QuadEaseIn (fn) {
  return v => fn(Quad.easeIn.getRatio(v));
}

$(() => {
  const smoke = $('#smoke');

  const smokeLeft = '#smoke-left';
  const smokeRight = '#smoke-right';

  const rps = v => 5 + (1 - v) * 40;

  const smokeProps = {
    rps,
    count: 30,
    y: QuadEaseIn(v => v * 550),
    rotation: v => Math.random() * 360,
    scale: QuadEaseIn(v => 0.08 + v / 2.5),
    opacity: QuadEaseIn(v => 1.2 - v)
  };

  const rotate = 10;
  const translateX = 120;

  $(smokeLeft)
    .smoke(smokeProps)
    .css({
      transform: `rotate(${rotate}deg) translateX(${translateX}px)`
    });

  $(smokeRight)
    .smoke({ ...smokeProps, rps: v => -rps(v) })
    .css({
      transform: `rotate(${-rotate}deg) translateX(${-translateX}px)`
    });

  const frost1 = '#frost-1';
  const frost2 = '#frost-2';

  TweenMax.set([ smoke, frost1, frost2 ], { opacity: 0 });

  const chill = TweenMax.to(frost1, 1, { opacity: 0.67, ease: Linear.easeInOut });

  const freeze = new Timeline({ paused: false })
    .to(smoke, 0, { opacity: 1 })
    .to(frost2, 2, { opacity: 1, ease: Quad.easeOut })
    .addLabel('start', '-=2.5')
    .from(smokeLeft, 2, { x: 50, rotate: 30 }, 'start')
    .from(smokeRight, 2, { x: -50, rotate: -30 }, 'start')
    .staggerFrom(`${smokeRight} .layer`, 5, { opacity: 0, ease: Quad.easeOut }, 0.1, 'start')
    .staggerFrom(`${smokeLeft} .layer`, 5, { opacity: 0, ease: Quad.easeOut }, 0.1, 'start');

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
