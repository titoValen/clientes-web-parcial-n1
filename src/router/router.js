import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Perfil from "@/pages/Perfil.vue";
import ChatGlobal from "@/pages/ChatGlobal.vue";
import ChatIndividual from "@/pages/ChatIndividual.vue";
import EmailConfirmation from "@/pages/EmailConfirmation.vue";
import Error404 from "@/pages/Error404.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/inicio-sesion", component: Login },
  { path: "/registarse", component: Register },
  { path: "/confirmacion", component: EmailConfirmation },
  { path: "/perfil", component: Perfil, meta: { requiresAuth: true } },
  { path: "/chat", component: ChatGlobal, meta: { requiresAuth: true } },
  { path: "/chat/:id", component: ChatIndividual, meta: { requiresAuth: true } },
  { path: "/:pathMatch", component: Error404 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// let user = {
//   id: null,
//   email: null,
// };

// subscribeToAuthUserChanges((userData) => (user = userData));

// router.beforeEach((to, from) => {
//   // console.log('Navegación de ruta: ', to);

//   if (to.meta?.requiresAuth && user.id == null) {
//     return "/inicio-sesion";
//   }
// });

export default router;
