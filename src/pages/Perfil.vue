<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  deleteAccount,
  getCurrentUser,
  logout,
  updateEmail,
  updatePassword,
} from "@/services/auth";
import { getProfileById, updateProfile } from "@/services/profiles";

const router = useRouter();
const currentUser = ref(null);
const isLoading = ref(true);
const isSavingProfile = ref(false);
const isSavingAccount = ref(false);
const isLoggingOut = ref(false);
const isDeleting = ref(false);
const showDeleteConfirmation = ref(false);
const pageError = ref("");
const profileMessage = ref("");
const accountMessage = ref("");
const deleteError = ref("");

const profileForm = reactive({
  display_name: "",
  bio: "",
  avatar_url: "",
});

const accountForm = reactive({
  email: "",
  password: "",
});

const initials = () => {
  const name = profileForm.display_name || currentUser.value?.email || "N";
  return name.slice(0, 1).toUpperCase();
};

async function loadProfile() {
  try {
    currentUser.value = await getCurrentUser();

    if (!currentUser.value) {
      await router.replace("/inicio-sesion");
      return;
    }

    accountForm.email = currentUser.value.email || "";
    profileForm.display_name =
      currentUser.value.user_metadata?.display_name || "";

    try {
      const profile = await getProfileById(currentUser.value.id);
      profileForm.display_name =
        profile.display_name || profileForm.display_name;
      profileForm.bio = profile.bio || "";
      profileForm.avatar_url = profile.avatar_url || "";
    } catch (error) {
      pageError.value =
        "No pudimos cargar todos los datos del perfil. Podés completar y guardar los campos.\n" +
        (error?.message || "");
    }
  } catch (error) {
    pageError.value = error?.message || "No pudimos cargar tu perfil.";
  } finally {
    isLoading.value = false;
  }
}

async function saveProfile() {
  if (!currentUser.value) return;

  profileMessage.value = "";
  pageError.value = "";
  isSavingProfile.value = true;

  try {
    const profile = await updateProfile(currentUser.value.id, profileForm);
    profileForm.display_name = profile.display_name || "";
    profileForm.bio = profile.bio || "";
    profileForm.avatar_url = profile.avatar_url || "";
    profileMessage.value = "Perfil actualizado correctamente.";
  } catch (error) {
    pageError.value = error?.message || "No pudimos actualizar tu perfil.";
  } finally {
    isSavingProfile.value = false;
  }
}

async function saveAccount() {
  accountMessage.value = "";
  pageError.value = "";
  isSavingAccount.value = true;

  try {
    let updatedEmail = false;

    if (accountForm.email !== currentUser.value.email) {
      await updateEmail(accountForm.email);
      updatedEmail = true;
    }

    if (accountForm.password) {
      await updatePassword(accountForm.password);
      accountForm.password = "";
    }

    accountMessage.value = updatedEmail
      ? "Datos actualizados. Revisá tu correo para confirmar el nuevo email."
      : "Datos de acceso actualizados correctamente.";
    currentUser.value.email = accountForm.email;
  } catch (error) {
    pageError.value = error?.message || "No pudimos actualizar tus datos.";
  } finally {
    isSavingAccount.value = false;
  }
}

async function handleLogout() {
  isLoggingOut.value = true;

  try {
    await logout();
    await router.replace("/inicio-sesion");
  } catch (error) {
    pageError.value = error?.message || "No pudimos cerrar sesión.";
  } finally {
    isLoggingOut.value = false;
  }
}

async function handleDeleteAccount() {
  deleteError.value = "";
  isDeleting.value = true;

  try {
    await deleteAccount();
    await router.replace("/");
  } catch (error) {
    deleteError.value =
      error?.message || "No pudimos eliminar la cuenta. Intentá nuevamente.";
  } finally {
    isDeleting.value = false;
  }
}

onMounted(loadProfile);
</script>

<template>
  <div
    class="relative isolate min-h-[calc(100vh-164px)] overflow-hidden bg-background"
  >
    <div
      class="pointer-events-none absolute -right-40 top-16 -z-10 size-112 rounded-full bg-primary/15 blur-[110px]"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute -bottom-48 -left-40 -z-10 size-112 rounded-full bg-secondary/10 blur-[110px]"
      aria-hidden="true"
    ></div>

    <div
      class="mx-auto w-[calc(100%-2.25rem)] max-w-290 py-10 sm:w-[calc(100%-4rem)] sm:py-14"
    >
      <div v-if="isLoading" class="py-16 text-center text-sm text-muted">
        Cargando tu perfil...
      </div>

      <template v-else>
        <header
          class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span
              class="flex items-center gap-2 text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]"
            >
              <span
                class="size-1.75 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"
              ></span>
              TU ESPACIO
            </span>
            <h1
              class="mt-3 font-heading text-4xl font-semibold tracking-[-2px]"
            >
              Tu perfil.
            </h1>
            <p class="mt-2 text-sm text-muted">
              Contale a la comunidad un poco más sobre vos.
            </p>
          </div>
          <button
            class="inline-flex min-h-10 w-fit cursor-pointer items-center justify-center rounded-lg border border-slate-400/20 px-4 text-xs font-semibold text-slate-300 transition hover:border-primary/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            {{ isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión" }}
          </button>
        </header>

        <p
          v-if="pageError"
          class="mb-6 whitespace-pre-line rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-xs leading-5 text-red-200"
          role="alert"
        >
          {{ pageError }}
        </p>

        <div class="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section
            class="rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] p-6 sm:p-8"
            aria-labelledby="profile-card-title"
          >
            <div
              class="flex items-center gap-4 border-b border-slate-400/15 pb-6"
            >
              <div
                class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-primary/40 bg-primary/20 font-heading text-xl font-semibold text-[#c5c6ff]"
              >
                <img
                  v-if="profileForm.avatar_url"
                  class="size-full object-cover"
                  :src="profileForm.avatar_url"
                  alt="Avatar del perfil"
                />
                <span v-else>{{ initials() }}</span>
              </div>
              <div class="min-w-0">
                <h2
                  id="profile-card-title"
                  class="truncate font-heading text-lg font-semibold"
                >
                  {{ profileForm.display_name || "Tu nombre" }}
                </h2>
                <p class="truncate text-xs text-muted">
                  {{ currentUser?.email }}
                </p>
              </div>
            </div>
            <p class="mt-6 text-xs leading-6 text-muted">
              Tu nombre y biografía serán visibles para las personas con las que
              converses.
            </p>
          </section>

          <section
            class="rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] p-6 sm:p-8"
            aria-labelledby="profile-form-title"
          >
            <h2
              id="profile-form-title"
              class="font-heading text-lg font-semibold"
            >
              Información pública
            </h2>
            <form class="mt-6 space-y-5" @submit.prevent="saveProfile">
              <div>
                <label
                  class="mb-2 block text-xs font-medium text-slate-300"
                  for="display-name"
                  >Nombre visible</label
                >
                <input
                  id="display-name"
                  v-model.trim="profileForm.display_name"
                  class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="text"
                  required
                />
              </div>
              <div>
                <label
                  class="mb-2 block text-xs font-medium text-slate-300"
                  for="bio"
                  >Biografía</label
                >
                <textarea
                  id="bio"
                  v-model.trim="profileForm.bio"
                  class="min-h-28 w-full resize-y rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 py-3 text-sm leading-6 text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Contá algo sobre vos..."
                ></textarea>
              </div>
              <div>
                <label
                  class="mb-2 block text-xs font-medium text-slate-300"
                  for="avatar-url"
                  >URL de avatar</label
                >
                <input
                  id="avatar-url"
                  v-model.trim="profileForm.avatar_url"
                  class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="url"
                  placeholder="https://..."
                />
              </div>
              <p
                v-if="profileMessage"
                class="rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-xs text-green-200"
                role="status"
              >
                {{ profileMessage }}
              </p>
              <button
                class="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                :disabled="isSavingProfile"
              >
                {{ isSavingProfile ? "Guardando..." : "Guardar perfil" }}
              </button>
            </form>
          </section>

          <section
            class="rounded-2xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.92),rgba(22,33,52,0.92))] p-6 sm:p-8 lg:col-span-2"
            aria-labelledby="account-form-title"
          >
            <h2
              id="account-form-title"
              class="font-heading text-lg font-semibold"
            >
              Datos de acceso
            </h2>
            <form
              class="mt-6 grid gap-5 md:grid-cols-2"
              @submit.prevent="saveAccount"
            >
              <div>
                <label
                  class="mb-2 block text-xs font-medium text-slate-300"
                  for="account-email"
                  >Correo electrónico</label
                >
                <input
                  id="account-email"
                  v-model.trim="accountForm.email"
                  class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="email"
                  required
                />
              </div>
              <div>
                <label
                  class="mb-2 block text-xs font-medium text-slate-300"
                  for="new-password"
                  >Nueva contraseña</label
                >
                <input
                  id="new-password"
                  v-model="accountForm.password"
                  class="min-h-11 w-full rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 text-sm text-text outline-none transition placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  type="password"
                  minlength="6"
                  placeholder="Dejá vacío para conservarla"
                  autocomplete="new-password"
                />
              </div>
              <div class="md:col-span-2">
                <p
                  v-if="accountMessage"
                  class="mb-4 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-xs text-green-200"
                  role="status"
                >
                  {{ accountMessage }}
                </p>
                <button
                  class="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-slate-400/25 px-4 text-sm font-semibold text-slate-200 transition hover:border-primary/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
                  type="submit"
                  :disabled="isSavingAccount"
                >
                  {{
                    isSavingAccount ? "Actualizando..." : "Actualizar acceso"
                  }}
                </button>
              </div>
            </form>
          </section>

          <section
            class="rounded-2xl border border-red-400/20 bg-red-950/10 p-6 sm:p-8 lg:col-span-2"
            aria-labelledby="danger-zone-title"
          >
            <h2
              id="danger-zone-title"
              class="font-heading text-lg font-semibold text-red-100"
            >
              Zona de cuenta
            </h2>
            <p class="mt-2 max-w-2xl text-xs leading-6 text-red-200/70">
              Eliminar tu cuenta es permanente y no se puede deshacer.
            </p>
            <div v-if="!showDeleteConfirmation" class="mt-5">
              <button
                class="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-red-400/30 px-4 text-xs font-semibold text-red-200 transition hover:bg-red-400/10"
                type="button"
                @click="showDeleteConfirmation = true"
              >
                Eliminar cuenta
              </button>
            </div>
            <div
              v-else
              class="mt-5 rounded-lg border border-red-400/20 bg-red-950/20 p-4"
            >
              <p class="text-xs font-medium text-red-100">
                ¿Confirmás que querés eliminar tu cuenta?
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  class="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg bg-red-500 px-4 text-xs font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                  type="button"
                  :disabled="isDeleting"
                  @click="handleDeleteAccount"
                >
                  {{ isDeleting ? "Eliminando..." : "Sí, eliminar cuenta" }}
                </button>
                <button
                  class="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-400/25 px-4 text-xs font-semibold text-slate-300 transition hover:text-white"
                  type="button"
                  :disabled="isDeleting"
                  @click="showDeleteConfirmation = false"
                >
                  Cancelar
                </button>
              </div>
              <p
                v-if="deleteError"
                class="mt-3 text-xs text-red-200"
                role="alert"
              >
                {{ deleteError }}
              </p>
            </div>
          </section>
        </div>
      </template>
    </div>
  </div>
</template>
