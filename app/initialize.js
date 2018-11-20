// import TimelineMax from 'gsap';
// import TweenMax from 'gsap';

// import TweenMax, { Power4 } from 'gsap/src/uncompressed/TweenMax';
// import EasePack from 'gsap/src/uncompressed/easing/EasePack';
// import TimelineMax from 'gsap/src/uncompressed/TimelineMax';

import TweenMax, { TimelineLite, Power3, Expo } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
  const bottle = $('#hero-bottle');
  // const bottle = $('#bottle');
  const frost1 = $('#frost-1');
  const frost2 = $('#frost-2');

  bottle.css({ opacity: 0 });
  frost1.css({ opacity: 0 });
  frost2.css({ opacity: 0 });

  console.log('Initialized app', TimelineLite, TweenMax);

  const timeline = new TimelineLite();
  const freeze = new TimelineLite();

  freeze.to(frost2, 4, { opacity: 1, ease: Expo.easeOut }, '+=0.5');
  timeline.to(bottle, 2, { opacity: 1, ease: Power3.easeOut }, '+=1');
  timeline.add(freeze);
});
