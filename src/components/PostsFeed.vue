<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { getCurrentUser } from "@/services/auth";
import {
  createPost,
  deletePost,
  getPosts,
  getPostsByUser,
  subscribeToPosts,
  updatePost,
} from "@/services/posts";

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
  canPublish: {
    type: Boolean,
    default: false,
  },
});

const posts = ref([]);
const newContent = ref("");
const editingPostId = ref(null);
const editingContent = ref("");
const currentUser = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref("");
const loadError = ref("");
const successMessage = ref("");
const deleteCandidate = ref(null);
let postsChannel;

function loadPosts() {
  return props.userId ? getPostsByUser(props.userId, { from: 0, to: 49 }) : getPosts({ from: 0, to: 49 });
}

function sortPosts() {
  posts.value.sort((first, second) => new Date(second.created_at) - new Date(first.created_at));
}

function upsertPost(post) {
  const index = posts.value.findIndex((item) => item.id === post.id);
  if (index === -1) {
    posts.value.push(post);
  } else {
    posts.value[index] = { ...posts.value[index], ...post };
  }
  sortPosts();
}

function removePost(postId) {
  posts.value = posts.value.filter((post) => post.id !== postId);
}

function getDisplayName(post) {
  return post.profiles?.display_name || (post.user_id === currentUser.value?.id ? "Vos" : "Usuario");
}

function getInitial(post) {
  return getDisplayName(post).slice(0, 1).toUpperCase();
}

function formatDate(date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function isOwnPost(post) {
  return post.user_id === currentUser.value?.id;
}

function beginEdit(post) {
  editingPostId.value = post.id;
  editingContent.value = post.content;
  errorMessage.value = "";
}

function cancelEdit() {
  editingPostId.value = null;
  editingContent.value = "";
}

async function refreshPosts() {
  posts.value = await loadPosts();
  sortPosts();
}

async function handleCreate() {
  const content = newContent.value.trim();
  if (!content || isSubmitting.value) return;

  errorMessage.value = "";
  successMessage.value = "";
  isSubmitting.value = true;

  try {
    await createPost(content);
    newContent.value = "";
    await refreshPosts();
    successMessage.value = "Publicación creada correctamente.";
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos crear la publicación.";
  } finally {
    isSubmitting.value = false;
  }
}

async function handleUpdate(post) {
  const content = editingContent.value.trim();
  if (!content || isSubmitting.value) return;

  errorMessage.value = "";
  successMessage.value = "";
  isSubmitting.value = true;

  try {
    await updatePost(post.id, content);
    upsertPost({ ...post, content });
    cancelEdit();
    successMessage.value = "Publicación actualizada correctamente.";
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos actualizar la publicación.";
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(post) {
  if (isSubmitting.value) return;

  deleteCandidate.value = post;
}

function cancelDelete() {
  deleteCandidate.value = null;
}

async function confirmDelete() {
  const post = deleteCandidate.value;
  if (!post || isSubmitting.value) return;

  errorMessage.value = "";
  successMessage.value = "";
  isSubmitting.value = true;

  try {
    await deletePost(post.id);
    removePost(post.id);
    deleteCandidate.value = null;
    successMessage.value = "Publicación eliminada correctamente.";
  } catch (error) {
    errorMessage.value = error?.message || "No pudimos borrar la publicación.";
  } finally {
    isSubmitting.value = false;
  }
}

async function loadFeed() {
  loadError.value = "";

  try {
    currentUser.value = await getCurrentUser();
    await refreshPosts();
    postsChannel = subscribeToPosts((payload) => {
      if (payload.eventType === "DELETE") {
        removePost(payload.old.id);
      } else if (!props.userId || payload.new.user_id === props.userId) {
        upsertPost(payload.new);
      }
    });
  } catch (error) {
    loadError.value = error?.message || "No pudimos cargar las publicaciones.";
  } finally {
    isLoading.value = false;
  }
}

async function retryLoad() {
  isLoading.value = true;
  await loadFeed();
}

onMounted(loadFeed);

onUnmounted(() => {
  postsChannel?.unsubscribe();
});
</script>

<template>
  <section aria-labelledby="posts-title">
    <h2 id="posts-title" class="font-heading text-xl font-semibold">Publicaciones</h2>

    <form v-if="canPublish" class="mt-5 rounded-2xl border border-slate-400/15 bg-surface p-4" @submit.prevent="handleCreate">
      <label class="sr-only" for="new-post">Nueva publicación</label>
      <textarea
        id="new-post"
        v-model="newContent"
        class="min-h-28 w-full resize-y rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 py-3 text-sm leading-6 text-text outline-none placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
        maxlength="500"
        placeholder="¿Qué querés compartir?"
        :disabled="isSubmitting"
        required
      ></textarea>
      <div class="mt-3 flex items-center justify-between gap-3">
        <span class="text-xs text-muted">{{ newContent.length }}/500</span>
        <button class="min-h-10 rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="isSubmitting || !newContent.trim()">
          {{ isSubmitting ? "Publicando..." : "Publicar" }}
        </button>
      </div>
    </form>

    <div v-if="loadError" class="mt-4 flex flex-col gap-3 rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-xs leading-5 text-red-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
      <span><strong>No pudimos cargar las publicaciones.</strong> {{ loadError }}</span>
      <button class="min-h-9 rounded-lg border border-red-300/30 px-3 font-semibold text-red-100 hover:bg-red-300/10" type="button" @click="retryLoad">Reintentar</button>
    </div>
    <p v-if="errorMessage" class="mt-4 rounded-lg border border-danger/25 bg-danger/10 px-4 py-3 text-xs leading-5 text-red-200" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="mt-4 rounded-lg border border-success/25 bg-success/10 px-4 py-3 text-xs leading-5 text-green-200" role="status">
      {{ successMessage }}
    </p>

    <div v-if="isLoading" class="py-12 text-center text-sm text-muted">Cargando publicaciones...</div>
    <p v-else-if="!posts.length" class="mt-5 rounded-2xl border border-dashed border-slate-400/20 px-5 py-12 text-center text-sm text-muted">
      Todavía no hay publicaciones.
    </p>
    <div v-else class="mt-5 space-y-4">
      <article v-for="post in posts" :key="post.id" class="rounded-2xl border border-slate-400/15 bg-surface p-5">
        <header class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <span class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/20 text-xs font-semibold text-[#c5c6ff]">
              <img v-if="post.profiles?.avatar_url" class="size-full object-cover" :src="post.profiles.avatar_url" alt="" />
              <span v-else>{{ getInitial(post) }}</span>
            </span>
            <div class="min-w-0">
              <strong class="block truncate text-sm text-slate-200">{{ getDisplayName(post) }}</strong>
              <time class="block text-xs text-muted" :datetime="post.created_at">{{ formatDate(post.created_at) }}</time>
            </div>
          </div>
          <div v-if="isOwnPost(post)" class="flex shrink-0 gap-2">
            <button class="text-xs font-medium text-[#b5b6ff] hover:text-white" type="button" :disabled="isSubmitting" @click="beginEdit(post)">Editar</button>
            <button class="text-xs font-medium text-red-300 hover:text-red-200" type="button" :disabled="isSubmitting" @click="handleDelete(post)">Borrar</button>
          </div>
        </header>

        <form v-if="editingPostId === post.id" class="mt-4" @submit.prevent="handleUpdate(post)">
          <label class="sr-only" :for="`edit-post-${post.id}`">Editar publicación</label>
          <textarea :id="`edit-post-${post.id}`" v-model="editingContent" class="min-h-24 w-full resize-y rounded-lg border border-slate-400/20 bg-slate-950/25 px-3 py-3 text-sm leading-6 text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" maxlength="500" :disabled="isSubmitting" required></textarea>
          <div class="mt-3 flex justify-end gap-2">
            <button class="min-h-9 rounded-lg border border-slate-400/25 px-3 text-xs font-semibold text-slate-300" type="button" :disabled="isSubmitting" @click="cancelEdit">Cancelar</button>
            <button class="min-h-9 rounded-lg bg-primary px-3 text-xs font-semibold text-white disabled:opacity-60" type="submit" :disabled="isSubmitting || !editingContent.trim()">Guardar</button>
          </div>
        </form>
        <p v-else class="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{{ post.content }}</p>
      </article>
    </div>

    <div v-if="deleteCandidate" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 px-4" @click.self="cancelDelete">
      <section class="w-full max-w-md rounded-2xl border border-slate-400/20 bg-surface p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-post-title" aria-describedby="delete-post-description">
        <h2 id="delete-post-title" class="font-heading text-lg font-semibold">¿Borrar publicación?</h2>
        <p id="delete-post-description" class="mt-2 text-sm leading-6 text-muted">Esta acción no se puede deshacer.</p>
        <div class="mt-6 flex justify-end gap-3">
          <button class="min-h-10 rounded-lg border border-slate-400/25 px-4 text-xs font-semibold text-slate-300 hover:text-white" type="button" :disabled="isSubmitting" @click="cancelDelete">Cancelar</button>
          <button class="min-h-10 rounded-lg bg-red-500 px-4 text-xs font-semibold text-white hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60" type="button" :disabled="isSubmitting" @click="confirmDelete">{{ isSubmitting ? "Borrando..." : "Sí, borrar" }}</button>
        </div>
      </section>
    </div>
  </section>
</template>
