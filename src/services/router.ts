import { useRouter as useR, createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import * as Pages from '@/pages/_index';
import { computed } from 'vue';

const useRouter = () => ({ goToPath, goToNamed, routes, currentRoute });

const routes = [
  { path: '/',        component: Pages.Home,    name: 'home' },
  { path: '/select',  component: Pages.Select,  name: 'select' },
  { path: '/workout', component: Pages.Workout, name: 'workout' },
  { path: '/create',  component: Pages.Create,  name: 'create' },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const currentRoute = computed(() => Router.currentRoute.value.name);
const goToPath = (path: string) => Router.push({ path });
const goToNamed = (name: string) => Router.push({ name })

export { useRouter, Router } ;