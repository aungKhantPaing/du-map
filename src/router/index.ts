import Vue from 'vue';
import VueRouter, { Route, RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Dock from '@/components/Dock.vue';
import OfflineDialog from '@/components/OfflineDialog.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    alias: '/place',
    children: [
      {
        path: '/place/:id',
        name: 'place',
        component: Dock,
        props: (route: Route) => {
          return { place: store.getters.placeById(route.params.id) };
        },
      },
    ],
  },

  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // }
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (store.getters.isSearching) {
    store.dispatch('closeSearch');
    next(false);
  } else {
    next();
  }
});

export default router;
