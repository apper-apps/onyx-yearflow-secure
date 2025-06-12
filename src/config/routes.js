import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  }
};

export const routeArray = Object.values(routes);