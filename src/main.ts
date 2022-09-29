import { createApp } from 'vue'
import * as Router from 'vue-router';
import App from '@/App.vue'
import routes from '@/routes';
import '&/index.scss'

const app = createApp(App);

const router = Router.createRouter({
  history: Router.createWebHashHistory(),
  routes,
});

app.use(router);

app.mount('#app');
