import pages from "./books/kuroneko-kissa/kuroneko-kissa.js";
const get = (id) => document.getElementById(id);
const picture = get('picture');
const spread = get('spread');
const sceneTitle = get('sceneTitle');
const story = get('story');
const cover = { text: story.textContent.replace('。今夜', '。\n今夜'), image: picture.getAttribute('src'), alt: picture.alt };
// Shared grid tracks follow the tallest passage at the current font size and width.
for (const scene of pages) {
  const measure = document.createElement('p');
  measure.className = 'storyMeasure';
  measure.setAttribute('aria-hidden', 'true');
  measure.textContent = scene.text;
  get('storyArea').append(measure);
}
const back = get('back');
const next = get('next');
let page = -1;
const motion = get('motion');
function setMotion(enabled) {
  document.body.classList.toggle('motion', enabled);
  motion.textContent = enabled ? 'アニメーションを止める' : 'アニメーションを再生';
}
setMotion(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
motion.addEventListener('click', () => setMotion(!document.body.classList.contains('motion')));

function show(index) {
  if (index < -1 || index >= pages.length || index === page) return;
  page = index;
  spread.dataset.page = String(page);
  get('shelf').hidden = page !== -1;
  const onCover = page === -1;
  motion.hidden = onCover;
  const scene = onCover ? cover : pages[page];
  spread.classList.toggle('cover', onCover);
  get('secret').hidden = page !== 1;
  get('whisper').hidden = true;
  picture.src = scene.image;
  picture.alt = scene.alt;
  get('coverTitle').hidden = !onCover;
  sceneTitle.hidden = onCover;
  sceneTitle.textContent = scene.title ?? '';
  story.textContent = scene.text;
  get('start').hidden = !onCover;
  get('home').hidden = onCover;
  get('navigation').hidden = onCover;
  get('progress').textContent = onCover ? '' : `${page + 1} / ${pages.length}`;
  next.textContent = page === pages.length - 1 ? 'もう一度読む' : '次のページ';
  spread.classList.remove('enter');
  void spread.offsetWidth;
  spread.classList.add('enter');
  if (onCover) get('start').focus();
  else sceneTitle.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

get('start').addEventListener('click', () => show(0));
get('home').addEventListener('click', () => show(-1));
back.addEventListener('click', () => show(page - 1));
next.addEventListener('click', () => show(page === pages.length - 1 ? 0 : page + 1));

document.addEventListener('keydown', (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === 'ArrowLeft') show(page - 1);
  if (event.key === 'ArrowRight') show(page + 1);
});

let touchStart;
picture.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  touchStart = event.touches.length === 1 ? [touch.clientX, touch.clientY] : null;
}, { passive: true });
picture.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart[0];
  const dy = touch.clientY - touchStart[1];
  touchStart = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) show(page + (dx < 0 ? 1 : -1));
}, { passive: true });
picture.addEventListener('touchcancel', () => { touchStart = null; });

get('secret').addEventListener('click', () => { get('whisper').hidden = false; });
