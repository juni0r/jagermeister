import $ from 'jquery';
import TweenMax, { TimelineLite, Power1, Linear } from 'gsap';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js';

document.addEventListener('DOMContentLoaded', () => {
  // const heroBottle = $('#hero-bottle');
  const bottle = $('#bottle');
  const frost1 = $('#frost-1');
  const frost2 = $('#frost-2');

  // heroBottle.css({ top: -400 });
  bottle.css({ opacity: 0 });
  frost1.css({ opacity: 0 });
  frost2.css({ opacity: 0 });

  const controller = new ScrollMagic.Controller();
  const timeline = new TimelineLite({ paused: false });

  // console.log('Initialized app', TimelineLite, TweenMax, ScrollMagic);

  TweenMax
    .to(bottle, 1, { opacity: 1, ease: Power1.easeOut, delay: 0.25 })
    .eventCallback('onComplete', () => {
      timeline.to(frost1, 3, { opacity: 1, ease: Linear.easeInOut }, '+=2');
      timeline.to(frost2, 4, { opacity: 1, ease: Linear.easeInOut }, '-=1');
      timeline.to(bottle, 2, { opacity: 1 });

      frost2.click(() => {
        timeline.reversed() ? timeline.play() : timeline.reverse();
      });
    });

  new ScrollMagic.Scene({
    triggerElement: '#freeze-start',
    triggerHook: 'onLeave',
    duration: 4000
  })
    .setPin('#hero-stage')
    .setTween(timeline)
    // .addIndicators({ name: '1 duration: 1600' })
    .addTo(controller);
});
