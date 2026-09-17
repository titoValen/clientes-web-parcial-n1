import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Chat from "../pages/Chat.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import NotFound from "../pages/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/chat", component: Chat },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: { hideLayout: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
