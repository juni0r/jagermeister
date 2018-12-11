import $ from 'jquery';
import TweenMax, { TimelineMax, Linear, Quad, Expo, SlowMo } from 'gsap';
import 'src/DrawSVGPlugin.js';
import { addScene } from 'src/scrollmagic';

$(() => {
  const container = '#wireframe-container';
  const wireframe = `${container} .wireframe`;
  const design = `${container} .design`;

  const animate = new TimelineMax({ paused: false });

  function imageFilter (ratio) {
    return { filter: `saturate(${ratio * 0.8}) sepia(${(1 - ratio) / 2})` };
  }

  function drawSVG (selector, duration, delay) {
    animate.fromTo(
      `${container} ${selector}`,
      duration,
      { drawSVG: 0 },
      { drawSVG: '102%', ease: Quad.easeOut },
      delay
    );
  }

  TweenMax.set(design, { opacity: 0, ...imageFilter(0) });

  animate.from(wireframe, 3, { scale: 2, ease: Quad.easeOut });
  animate.from(wireframe, 1, { opacity: 0, ease: Quad.easeOut }, '-=3');

  drawSVG('.bottle', 3, '-=3');
  drawSVG('.text', 2);
  drawSVG('.navi', 2, '-=1');
  drawSVG('.outline', 2, '-=3');

  animate.to(wireframe, 2, { opacity: 0, ease: Quad.easeIn });
  animate.to(design, 2, { opacity: 1, ease: Quad.easeOut }, '-=2');
  animate.to(design, 2, { opacity: 1,
    ease: Quad.easeOut,
    onUpdateParams: ['{self}'],
    onUpdate: (tween) => {
      TweenMax.set(design, imageFilter(tween.progress()));
    } });

  addScene('#wireframe-start', {
    pin: '#wireframe-stage',
    duration: '500%',
    tween: animate
  });
});
