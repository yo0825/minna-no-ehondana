import catPages from './books/kuroneko-kissa/kuroneko-kissa.js';
import pancake from './books/pancake/pancake.js?v=rhythm';
import forest from './books/forest-picnic/forest-picnic.js';
const get = (id) => document.getElementById(id);
const picture = get('picture');
const spread = get('spread');
const sceneTitle = get('sceneTitle');
const story = get('story');
const books = [
  {
    slug: 'kuroneko-kissa',
    title: '黒猫喫茶、夜の灯り',
    intro: '仕事帰りに見つけた、小さな喫茶店のお話。',
    image: 'books/kuroneko-kissa/cover.webp',
    pages: catPages
  },
  pancake,
  forest
];
let book;
let opener;
const storyArea = get('storyArea');

function openBook(selected, button) {
  book = selected;
  opener = button;
  storyArea.querySelectorAll('.storyMeasure').forEach(node => node.remove());
  for (const scene of book.pages) {
    const measure = document.createElement('p');
    measure.className = 'storyMeasure';
    measure.setAttribute('aria-hidden', 'true');
    measure.textContent = scene.text;
    storyArea.append(measure);
  }
  get('readingBook').textContent = book.title;
  show(0);
}

for (const selected of books) {
  const card = document.createElement('article');
  card.className = 'book-card';
  const button = document.createElement('button');
  button.type = 'button';
  button.addEventListener('click', () => openBook(selected, button));
  const image = document.createElement('img');
  image.className = 'book-cover';
  image.src = selected.image;
  image.alt = '';
  const label = document.createElement('span');
  label.className = 'book-label';
  label.textContent = selected.title;
  const intro = document.createElement('p');
  intro.className = 'book-intro';
  intro.textContent = selected.intro;
  button.append(image, label);
  card.append(button, intro);
  get('bookList').append(card);
}

const secret = get('secret');
const whisper = get('whisper');
function showWhisper(visible) {
  whisper.hidden = !visible;
  secret.setAttribute('aria-expanded', String(visible));
}
secret.addEventListener('click', () => showWhisper(whisper.hidden));
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
  if (!book || index < -1 || index >= book.pages.length || index === page) return;
  page = index;
  const onShelf = page === -1;
  get('shelf').hidden = !onShelf;
  for (const node of [spread, motion, get('home'), get('navigation')]) node.hidden = onShelf;
  secret.hidden = book.slug !== 'kuroneko-kissa' || page !== 1;
  showWhisper(false);
  spread.classList.remove('enter');
  if (onShelf) {
    opener.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return;
  }
  const scene = book.pages[page];
  spread.dataset.book = book.slug;
  spread.dataset.page = String(page);
  picture.src = scene.image;
  picture.alt = scene.alt;
  sceneTitle.hidden = false;
  sceneTitle.textContent = scene.title;
  story.textContent = scene.text;
  get('progress').textContent = (page + 1) + ' / ' + book.pages.length;
  next.textContent = page === book.pages.length - 1 ? 'もう一度読む' : '次のページ';
  void spread.offsetWidth;
  spread.classList.add('enter');
  sceneTitle.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

get('home').addEventListener('click', () => show(-1));
back.addEventListener('click', () => show(page - 1));
next.addEventListener('click', () => show(page === book.pages.length - 1 ? 0 : page + 1));

document.addEventListener('keydown', (event) => {
  if (page < 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
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
