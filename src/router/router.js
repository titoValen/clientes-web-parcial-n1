import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Perfil from "@/pages/Perfil.vue";
import ChatGlobal from "@/pages/ChatGlobal.vue";
import ChatIndividual from "@/pages/ChatIndividual.vue";
import PublicProfile from "@/pages/PublicProfile.vue";
import EmailConfirmation from "@/pages/EmailConfirmation.vue";
import Error404 from "@/pages/Error404.vue";
import { getSession } from "@/services/auth";

const routes = [
  { path: "/", component: Home },
  { path: "/inicio-sesion", component: Login, meta: { guestOnly: true } },
  { path: "/registarse", component: Register, meta: { guestOnly: true } },
  { path: "/registrarse", redirect: "/registarse" },
  { path: "/confirmacion", component: EmailConfirmation },
  { path: "/perfil", component: Perfil, meta: { requiresAuth: true } },
  { path: "/chat", component: ChatGlobal, meta: { requiresAuth: true } },
  { path: "/chat/:id", component: ChatIndividual, meta: { requiresAuth: true } },
  { path: "/usuario/:id", component: PublicProfile },
  { path: "/:pathMatch", component: Error404 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  let session = null;

  try {
    session = await getSession();
  } catch {
    session = null;
  }

  if (to.meta.requiresAuth && !session) {
    return { path: "/inicio-sesion", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && session) {
    return "/chat";
  }
});

export default router;
