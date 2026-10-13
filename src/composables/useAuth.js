import { ref } from "vue";
import { getSession, onAuthChange } from "@/services/auth";

const user = ref(null);
const isAuthReady = ref(false);
let initialized = false;
let authChangeVersion = 0;
let authSubscription;

function initAuth() {
  if (initialized) return;

  initialized = true;
  const { data } = onAuthChange((_event, session) => {
    authChangeVersion += 1;
    user.value = session?.user ?? null;
  });
  authSubscription = data.subscription;

  const sessionVersion = authChangeVersion;
  getSession()
    .then((session) => {
      if (sessionVersion === authChangeVersion) {
        user.value = session?.user ?? null;
      }
    })
    .catch(() => {
      if (sessionVersion === authChangeVersion) {
        user.value = null;
      }
    })
    .finally(() => {
      isAuthReady.value = true;
    });
}

function cleanup() {
  authSubscription?.unsubscribe();
  authSubscription = undefined;
  initialized = false;
  isAuthReady.value = false;
}

export function useAuth() {
  return { user, isAuthReady, initAuth, cleanup };
}