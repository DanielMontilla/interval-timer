import { vueComponent } from '@/types';
import { computed, ref } from 'vue';
import { useState } from '@/services/_index';

const routes = new Map<string, { defTitle: string; component: vueComponent }>();
const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
   currentPath.value = window.location.hash;
});

const initRoutes = async (
   _routes: Record<string, { defTitle: string; component: vueComponent }>,
   initial?: { route: string; title?: string }
) => {
   for (const route in _routes) {
      if (Object.prototype.hasOwnProperty.call(_routes, route)) {
         const obj = _routes[route];
         routes.set(route, obj);
      }
   }
   if (initial) await goTo(initial.route, initial.title);
};

const currentPage = computed<vueComponent>(() => {
   let path = currentPath.value.slice(1);
   // @ts-ignore
   return routes.has(path) ? routes.get(path).component : routes.get(`/`).component;
});

const goTo = async (route: string, title?: string) => {
   const { pageTitle } = useState();

   if (routes.has(route)) {
      window.location.hash = route;

      // @ts-ignore
      pageTitle.value = title ? title : routes.get(route).defTitle;
      return true;
   }

   return false;
};

const useRouter = () => ({ initRoutes, currentPage, currentPath, goTo });

export default useRouter;
