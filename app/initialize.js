import $ from 'jquery';
import TweenMax, { TimelineMax, Linear, Quad } from 'gsap';
import { addScene } from 'src/scrollmagic';
import 'src/smoke';

$(() => {
  const smoke = $('#smoke');

  const smokeLeft = '#smoke-left';
  const smokeRight = '#smoke-right';

  const rps = v => 5 + (1 - v) * 30;
  const count = 30;

  $(smokeLeft).smoke({ count, rps: x => -rps(x) });
  $(smokeRight).smoke({ count, rps });

  const layer1 = '.layer-1';
  const layer2 = '.layer-2';

  TweenMax.set([ smoke, layer1, layer2 ], { opacity: 0 });

  const chill = TweenMax.to(layer1, 1, { opacity: 0.67, ease: Linear.easeInOut });

  const freeze = new TimelineMax({ paused: false })
    .to(smoke, 0, { opacity: 1 })
    .addLabel('start')
    .to(layer2, 2, { opacity: 1, ease: Quad.easeOut })
    .staggerFrom(`${smokeRight} .layer`, 3, { opacity: 0, ease: Quad.easeOut }, 0.05, 'start')
    .staggerFrom(`${smokeLeft} .layer`, 3, { opacity: 0, ease: Quad.easeOut }, 0.05, 'start')

  addScene('#freeze-start', {
    pin: '#hero-stage',
    duration: 800,
    tween: chill
  });

  addScene('#freeze-start', {
    pin: '#hero-stage',
    duration: 400,
    offset: 800
  });

  addScene('#smoke-start', {
    offset: 800,
    tween: freeze
  });
});
