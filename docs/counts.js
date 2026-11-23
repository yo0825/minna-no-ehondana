import { counterURL } from './config.js';
const el = id => document.getElementById(id);
const buttons = ['likes','marks'];
let state;
function identifier(storage,key) {
  let value = storage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    storage.setItem(key,value);
  }
  return value;
}
async function update(action, enabled) {
  buttons.forEach(key => el(key).disabled = true);
  try {
    const scope = location.pathname.replace(/index\.html$/, '');
    const visitor = identifier(localStorage, scope+'book-reader');
    const visit = identifier(sessionStorage, scope+'book-session');
    const response = await fetch(counterURL, {method:'POST',body:JSON.stringify({visitor,visit,action,enabled})});
    if (!response.ok) throw new Error();
    state = await response.json();
    el('visits').textContent = state.visits;
    for (const key of buttons) {
      el(key).textContent = (key==='likes'?'♡ いいね ':'しおり ')+state[key];
      el(key).setAttribute('aria-pressed',String(state.selected[key]));
    }
    el('notice').textContent='';
  } catch {
    el('notice').textContent='集計を取得できませんでした。ページを再読み込みしてください。';
    state=null;
  } finally {
    buttons.forEach(key => el(key).disabled = !state);
  }
}
if(counterURL) {
  el('counts').hidden=false;
  for(const key of buttons) el(key).onclick=()=>update(key,!state.selected[key]);
  update('open');
}
