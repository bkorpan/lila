import throttle from 'common/throttle';

let timeout: number | undefined;
let booted = false;
let lastSet: number | undefined;

export function start(container: HTMLElement) {

  /* Detected browsers with a correct grid min-content implementation:
   * Chrome, Chromium, Brave, Opera, Safari 12+
   */
  if (window.chrome) return;

  const runHacks = throttle(100, () => {
    window.lichess.raf(() => {
      fixBoardHeight(container);
      schedule();
    });
  });

  function schedule() {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(runHacks, 500);
  }

  runHacks();

  if (!booted) {
    booted = true;
    document.body.addEventListener('chessground.resize', runHacks);
  }
}

// Firefox 60- needs this to properly compute the grid layout.
function fixBoardHeight(container: HTMLElement) {
  const el = container.querySelector('.main-board') as HTMLElement,
  width = el.offsetWidth;
  if (lastSet != width) {
    lastSet = width;
    el.style.height = width + 'px';
    window.lichess.dispatchEvent(document.body, 'chessground.resize');
  }
}