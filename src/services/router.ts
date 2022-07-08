import { vueComponent } from '@/types';
import { computed, ref } from 'vue';

const routes = new Map<string, vueComponent>();
const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
   currentPath.value = window.location.hash;
});

const initRoutes = (_routes: Record<string, vueComponent>) => {
   for (const route in _routes) {
      if (Object.prototype.hasOwnProperty.call(_routes, route)) {
         const component = _routes[route];
         routes.set(route, component);
      }
   }
   currentPath.value = '#/';
};

const currentPage = computed<vueComponent>(() => {
   let path = currentPath.value.slice(1);
   return routes.has(path) ? routes.get(path) : routes.get(`/`);
});

const goTo = async (route: string) => {
   if (routes.has(route)) {
      window.location.hash = '#' + route;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      return true;
   }

   return false;
};

const useRouter = () => ({ initRoutes, currentPage, currentPath, goTo });

export default useRouter;
