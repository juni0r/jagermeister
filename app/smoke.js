import $ from 'jquery';
import { Ease, LayerGenerator, Range } from 'src/smoke';

window.$ = $;

$(() => {
  const $smoke = $('#smoke').smoke();

  const ease = Ease(2);

  let generator;

  const layerCount = 30;

  const xFrom = 80;
  const xTo = 120;
  const xJitter = 0;

  const rpsFrom = 0.08;
  const rpsTo = 0.01;

  generator = new LayerGenerator({
    x: Range({ from: xFrom, to: xTo, jitter: xJitter, scale: ease.in }),
    y: Range({ from: 0, to: 650, jitter: 20, scale: ease.in }),
    opacity: Range({ from: 1, to: 0, scale: ease.in }),
    scale: Range({ from: 0.15, to: 0.5, scale: ease.in }),
    rps: Range({ from: rpsFrom, to: rpsTo, scale: ease.in }),
    zIndex: Range({ from: 999, to: 1999, scale: ease.in }),
    rotate: () => Math.random()
  });

  const layers = [];

  generator.make(layerCount, layers);

  generator.ranges.x = Range({ from: -xFrom, to: -xTo, jitter: xJitter, scale: ease.in });
  generator.ranges.rps = Range({ from: -rpsFrom, to: -rpsTo, scale: ease.in });
  generator.make(layerCount, layers);

  $smoke.smoke('load', layers);
});
