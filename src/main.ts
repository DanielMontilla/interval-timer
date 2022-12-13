import { createApp } from 'vue'
import InlineSvg from 'vue-inline-svg';
import App from '@/App.vue'
import '@/index.css'
import { Router } from '@/services/_index';


createApp(App)
  .component('inline-svg', InlineSvg)
  .use(Router)
  .mount('#app');
