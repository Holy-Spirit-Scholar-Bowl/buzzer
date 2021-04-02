import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import NProgress from "nprogress";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Main",
    component: () => import("@/views/Main.vue"),
  },
  {
    path: "/about",
    name: "How it Works",
    component: () => import("@/views/HowItWorks.vue"),
  },
  {
    path: "/changelog",
    name: "Changelog",
    component: () => import("@/views/Changelog.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start();
    from;
  }
  next();
});

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  NProgress.done();
});

export default router;
