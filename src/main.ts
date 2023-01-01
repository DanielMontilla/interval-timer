import { createApp } from 'vue'
import InlineSvg from 'vue-inline-svg';
import App from '@/App.vue'
import '@/index.css'
import { Router } from '@/services/_index';
import { clamp } from '@/util';

createApp(App)
  .component('inline-svg', InlineSvg)
  .use(Router)
  .mount('#app');

const enterPWA = () => {
  console.log('enabled PWA startup')
  // LOCK SCREEN SIZE
  const resize = () => {
    const height = window.outerHeight;
    const width = clamp(window.outerWidth, { min: 350, max: 640 });
    window.resizeTo(width, height);
  }
  
  window.addEventListener('resize', resize);
  resize();

  // PREVENT DEV TOOLS
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener("keydown", e => {
    const key = e.key || e.keyCode;
    if (key == 123) {
        return false;
    } else if ((e.ctrlKey && e.shiftKey && key == 73) || (e.ctrlKey && e.shiftKey && key == 74)) {
        return false;
    }
  }, false);
}

window.addEventListener('appinstalled', enterPWA)
window.addEventListener('DOMContentLoaded', () => {
  if (!window.matchMedia('(display-mode: standalone)').matches) return;
  enterPWA();
});