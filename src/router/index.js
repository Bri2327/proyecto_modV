import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import ProductsView from "../views/ProductsView.vue";
import ProductDetailView from "../views/ProductDetailView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  {
    path: "/categorias",
    name: "categorias",
    component: CategoriesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/productos",
    name: "productos",
    component: ProductsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/productos/:id",
    name: "producto-detalle",
    component: ProductDetailView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !token) {
    return { path: "/login" };
  }

  if ((to.path === "/login" || to.path === "/register") && token) {
    return { path: "/productos" };
  }

  return true;
});

export default router;