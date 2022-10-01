import * as Pages from '@/pages/_index';

const routes = [
  { path: '/',        component: Pages.Home,    name: 'home' },
  { path: '/select',  component: Pages.Select,  name: 'select' },
  { path: '/workout', component: Pages.Workout, name: 'workout' },
  { path: '/create',  component: Pages.Create,  name: 'create' },
]

export default routes;