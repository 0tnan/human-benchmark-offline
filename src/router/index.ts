import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/game-selection",
    name: "game-selection",
    // route level code-splitting
    // this generates a separate chunk (game-selection.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "game-selection" */ "../views/GameSelection.vue"
      ),
  },
  {
    path: "/sequence-memory",
    name: "sequence-memory",
    // route level code-splitting
    // this generates a separate chunk (sequence-memory.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "sequence-memory" */ "../views/SequenceMemoryView.vue"
      ),
  },
  {
    path: "/number-memory",
    name: "number-memory",
    // route level code-splitting
    // this generates a separate chunk (number-memory.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "number-memory" */ "../views/NumberMemoryView.vue"
      ),
  },
  {
    path: "/reaction-time",
    name: "reaction-time",
    // route level code-splitting
    // this generates a separate chunk (reaction-time.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "reaction-time" */ "../views/ReactionTimeView.vue"
      ),
  },
  {
    path: "/settings",
    name: "settings",
    // route level code-splitting
    // this generates a separate chunk (settings.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/SettingsView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
