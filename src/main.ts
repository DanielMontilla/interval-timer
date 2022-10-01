import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import InlineSvg from 'vue-inline-svg';
import App from '@/App.vue'
import routes from '@/routes';
import '@/index.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App)
  .component('inline-svg', InlineSvg)
  .use(router)
  .mount('#app');
