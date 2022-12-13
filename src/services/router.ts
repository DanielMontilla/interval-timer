import { useRouter as useR, createRouter, createWebHashHistory } from 'vue-router'
import * as Pages from '@/pages/_index';

const useRouter = () => ({ goToPath, goToNamed, routes });

const routes = [
  { path: '/',        component: Pages.Home,    name: 'home' },
  { path: '/select',  component: Pages.Select,  name: 'select' },
  { path: '/workout', component: Pages.Workout, name: 'workout' },
  { path: '/create',  component: Pages.Create,  name: 'create' },
]

const Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const goToPath = (path: string) => Router.push({ path });
const goToNamed = (name: string) => Router.push({ name })


export { useRouter, Router } ;