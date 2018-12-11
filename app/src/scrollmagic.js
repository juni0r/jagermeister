import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js';
import 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js';

const debugScrollMagic = false;

export const controller = new ScrollMagic.Controller();

export function addScene (triggerElement, { duration = 0, offset = 0, triggerHook = 'onLeave', tween, pin, reverse = true }) {
  const scene = new ScrollMagic.Scene({ triggerElement, triggerHook, duration, offset });
  if (pin) scene.setPin(pin);
  if (tween) scene.setTween(tween);
  scene.reverse(reverse);
  if (debugScrollMagic) scene.addIndicators({ name: triggerElement });
  scene.addTo(controller);
  return scene;
}

export default ScrollMagic;
