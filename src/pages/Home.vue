<script setup>
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const { user, isAuthReady, initAuth } = useAuth();

onMounted(() => {
  initAuth();
});

const features = [
  {
    number: "01",
    title: "Una charla, muchas voces",
    description:
      "Sumate al chat global y encontrá personas con ganas de conversar.",
    icon: "chat",
  },
  {
    number: "02",
    title: "Más cerca, en privado",
    description:
      "Seguí las conversaciones que más te interesan con mensajes directos.",
    icon: "lock",
  },
  {
    number: "03",
    title: "Tu espacio, tu perfil",
    description:
      "Armá tu perfil y compartí un poco de quién sos con la comunidad.",
    icon: "user",
  },
];
</script>

<template>
  <div class="relative isolate min-h-screen overflow-hidden bg-background font-sans text-text">
    <div
      class="pointer-events-none absolute -right-52 top-4 -z-10 size-[34rem] rounded-full bg-primary/15 blur-[110px]"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute -left-[25rem] top-[34rem] -z-10 size-[34rem] rounded-full bg-secondary/10 blur-[110px]"
      aria-hidden="true"
    ></div>

    <div class="mx-auto w-[calc(100%-2.25rem)] max-w-[1160px] sm:w-[calc(100%-4rem)]">
      <section
        class="grid grid-cols-1 items-center gap-9 py-[58px] sm:gap-10 sm:py-[66px] lg:min-h-[625px] lg:grid-cols-[0.91fr_1.09fr] lg:gap-10 lg:py-[62px]"
        aria-labelledby="hero-title"
      >
        <div class="relative z-[1] pb-1">
          <div class="flex items-center gap-[9px] text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]">
            <span class="size-[7px] shrink-0 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
            UN LUGAR PARA CONECTAR
          </div>
          <h1
            id="hero-title"
            class="mb-[19px] mt-[21px] font-heading text-[clamp(49px,12vw,64px)] font-semibold leading-[1.04] tracking-[-3.8px] sm:mt-[25px] lg:text-[clamp(48px,5.25vw,69px)] lg:tracking-[-4.3px]"
          >
            Las buenas<br />
            conversaciones<br />
            <span class="text-[#8183f5]">empiezan acá.</span>
          </h1>
          <p class="max-w-[430px] text-[13px] leading-[1.85] text-muted sm:text-sm">
            Un espacio simple para compartir ideas, conocer gente y seguir
            hablando. A tu ritmo, con tu comunidad.
          </p>
          <div class="mt-[30px] flex items-center gap-[25px]">
            <RouterLink
              v-if="isAuthReady && !user"
              class="inline-flex min-h-[52px] min-w-[174px] items-center justify-center gap-[19px] rounded-[9px] border border-transparent bg-primary px-[19px] text-[13px] font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)]"
              to="/registrarse"
            >
              Empezar ahora <span aria-hidden="true">↗</span>
            </RouterLink>
            <RouterLink
              v-else-if="isAuthReady && user"
              class="inline-flex min-h-[52px] min-w-[174px] items-center justify-center gap-[19px] rounded-[9px] border border-transparent bg-primary px-[19px] text-[13px] font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)]"
              to="/chat"
            >
              Ir al chat <span aria-hidden="true">↗</span>
            </RouterLink>
            <a
              class="inline-flex items-center gap-[9px] text-xs font-medium text-slate-300 no-underline"
              href="#como-funciona"
            >
              Conocé más <span class="text-secondary" aria-hidden="true">↓</span>
            </a>
          </div>
          <div class="mt-7 flex items-center gap-[13px] text-[10px] text-[#8491a5] sm:mt-10">
            <span class="flex pl-0.5" aria-hidden="true">
              <span class="grid size-[25px] shrink-0 place-items-center rounded-full border-2 border-background bg-[#c4b5fd] text-[9px] font-bold text-[#172033]">M</span>
              <span class="-ml-[7px] grid size-[25px] shrink-0 place-items-center rounded-full border-2 border-background bg-[#99f6e4] text-[9px] font-bold text-[#172033]">S</span>
              <span class="-ml-[7px] grid size-[25px] shrink-0 place-items-center rounded-full border-2 border-background bg-[#fdba9a] text-[9px] font-bold text-[#172033]">L</span>
              <span class="-ml-[7px] grid size-[25px] shrink-0 place-items-center rounded-full border-2 border-background bg-slate-700 text-[9px] font-bold text-slate-300">+</span>
            </span>
            <span>Las conversaciones se disfrutan más en compañía.</span>
          </div>
        </div>

        <div id="comunidad" class="relative grid min-h-[385px] place-items-center sm:min-h-[438px]">
          <div class="absolute size-[min(92vw,375px)] rounded-full border border-[#8183f5]/15 sm:size-[405px]"></div>
          <div class="absolute size-[min(74vw,305px)] rounded-full border border-secondary/15 sm:size-[330px]"></div>
          <div
            class="relative z-[1] w-full rounded-2xl border border-slate-400/20 bg-[linear-gradient(145deg,rgba(30,41,59,0.97),rgba(22,33,52,0.97))] px-4 py-[21px] pb-[18px] shadow-[0_28px_90px_rgba(0,0,0,0.35),0_0_60px_rgba(99,102,241,0.07)] sm:max-w-[438px] sm:px-[22px]"
          >
            <div class="flex items-center justify-between border-b border-slate-400/15 pb-[18px]">
              <div class="flex items-center gap-[11px]">
                <span class="grid size-[39px] place-items-center rounded-[11px] border border-primary/25 bg-primary/15 text-[#a5a6ff]" aria-hidden="true">
                  <svg class="size-[22px]" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v6.5A2.75 2.75 0 0 1 17.25 15H11l-4.5 3.5V15h-.75A2.75 2.75 0 0 1 3 12.25v-6.5Z"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M8 8h8M8 11h5"
                      stroke="currentColor"
                      stroke-width="1.7"
                      stroke-linecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <h2 class="mb-[5px] font-heading text-sm font-semibold tracking-[-0.3px]">
                    La charla de hoy
                  </h2>
                  <p class="m-0 flex items-center gap-1.5 text-[9px] text-muted">
                    <span class="size-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
                    24 personas conversando
                  </p>
                </div>
              </div>
              <button class="border-0 bg-transparent text-[21px] tracking-[1px] text-muted" type="button" aria-label="Más opciones">
                ···
              </button>
            </div>

            <div class="my-[17px] flex items-center gap-3 text-[8px] font-bold tracking-[1.4px] text-slate-500 before:h-px before:flex-1 before:bg-slate-400/15 after:h-px after:flex-1 after:bg-slate-400/15">
              <span>HOY</span>
            </div>

            <div class="mb-[14px] flex items-start gap-[9px]">
              <span class="grid size-[27px] shrink-0 place-items-center rounded-full bg-[#c4b5fd] text-[9px] font-bold text-[#172033]">M</span>
              <div class="min-w-0">
                <div class="mb-[5px] flex items-center gap-2">
                  <strong class="text-[9px] font-semibold text-slate-200">Martina</strong>
                  <span class="text-[8px] text-slate-500">10:42</span>
                </div>
                <div class="w-fit max-w-[290px] rounded-[3px_10px_10px] border border-slate-400/10 bg-[#273449] px-[11px] py-[9px] text-[10px] leading-[1.55] text-slate-300">
                  ¿Qué canción no te cansás de escuchar? 🎧
                </div>
              </div>
            </div>

            <div class="mb-[14px] flex items-start gap-[9px]">
              <span class="grid size-[27px] shrink-0 place-items-center rounded-full bg-[#99f6e4] text-[9px] font-bold text-[#172033]">S</span>
              <div class="min-w-0">
                <div class="mb-[5px] flex items-center gap-2">
                  <strong class="text-[9px] font-semibold text-slate-200">Santi</strong>
                  <span class="text-[8px] text-slate-500">10:43</span>
                </div>
                <div class="w-fit max-w-[290px] rounded-[3px_10px_10px] border border-slate-400/10 bg-[#273449] px-[11px] py-[9px] text-[10px] leading-[1.55] text-slate-300">
                  Cualquiera de El Kuelgue, siempre.
                </div>
              </div>
            </div>

            <div class="mb-[14px] flex items-start gap-[9px]">
              <span class="grid size-[27px] shrink-0 place-items-center rounded-full bg-[#fdba9a] text-[9px] font-bold text-[#172033]">L</span>
              <div class="min-w-0">
                <div class="mb-[5px] flex items-center gap-2">
                  <strong class="text-[9px] font-semibold text-slate-200">Lucía</strong>
                  <span class="text-[8px] text-slate-500">10:44</span>
                </div>
                <div class="w-fit max-w-[290px] rounded-[3px_10px_10px] border border-primary/20 bg-primary/20 px-[11px] py-[9px] text-[10px] leading-[1.55] text-slate-300">
                  Vine a buscar recomendaciones y ya tengo una 😄
                </div>
              </div>
            </div>

            <div class="mb-[14px] ml-9 flex items-center gap-2 text-[8px] text-slate-400">
              <span class="flex gap-[3px]" aria-hidden="true">
                <i class="size-[3px] rounded-full bg-[#a5a6ff]"></i>
                <i class="size-[3px] rounded-full bg-[#a5a6ff]"></i>
                <i class="size-[3px] rounded-full bg-[#a5a6ff]"></i>
              </span>
              Alguien está escribiendo
            </div>

            <div class="flex min-h-[41px] items-center justify-between rounded-lg border border-slate-400/15 py-[5px] pl-3 pr-[6px] text-[9px] text-slate-500">
              <span>Escribí algo lindo...</span>
              <button class="grid size-[29px] place-items-center rounded-md border-0 bg-primary text-white" type="button" aria-label="Enviar mensaje" tabindex="-1">
                <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="m3 9 13-6-4.8 14-2.1-5.1L3 9Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                  <path d="m9.1 11.9 4.1-4.1" stroke="currentColor" stroke-width="1.5" />
                </svg>
              </button>
            </div>
          </div>

          <div class="absolute -top-[7px] left-[-1px] z-[2] flex items-center gap-2 rounded-full border border-slate-400/15 bg-surface px-3 py-[9px] text-[9px] text-slate-300 shadow-[0_14px_40px_rgba(0,0,0,0.22)] sm:-top-[18px] sm:left-3">
            <span class="size-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
            un espacio siempre abierto
          </div>
          <div class="absolute -bottom-[25px] right-[-1px] z-[2] flex items-center gap-[11px] rounded-[10px] border border-slate-400/15 bg-surface px-[15px] py-3 text-[9px] leading-[1.6] text-muted shadow-[0_14px_40px_rgba(0,0,0,0.22)] sm:bottom-[54px] sm:right-[-8px]">
            <span class="text-[23px] text-secondary" aria-hidden="true">✳</span>
            <span><strong class="text-[10px] font-semibold text-slate-200">Tu próxima charla</strong><br />puede empezar hoy.</span>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="border-t border-white/10 py-[38px] sm:py-[46px]" aria-labelledby="features-title">
        <div class="mb-[21px] block sm:mb-[26px] sm:flex sm:items-end sm:justify-between sm:gap-[35px]">
          <div>
            <div class="flex items-center gap-[9px] text-[10px] font-bold tracking-[1.65px] text-[#b5b6ff]">
              <span class="size-[7px] shrink-0 rounded-full bg-secondary shadow-[0_0_12px_rgba(20,184,166,0.5)]"></span>
              TODO EN UN MISMO LUGAR
            </div>
            <h2 id="features-title" class="mt-[13px] font-heading text-[clamp(25px,3vw,34px)] font-medium tracking-[-1.4px]">
              Conectar no debería ser complicado.
            </h2>
          </div>
          <p class="mt-[11px] max-w-[310px] text-[11px] leading-[1.8] text-muted sm:mb-[3px] sm:mt-0">
            Lo importante es lo que tenés para decir. De lo demás, nos ocupamos acá.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-[10px] sm:grid-cols-3 sm:gap-[15px]">
          <article
            v-for="feature in features"
            :key="feature.number"
            class="min-h-0 rounded-xl border border-slate-400/15 bg-[linear-gradient(145deg,rgba(30,41,59,0.75),rgba(30,41,59,0.42))] p-4 transition hover:-translate-y-[3px] hover:border-[#8183f5]/40 sm:min-h-[173px] sm:p-5"
          >
            <div class="flex items-center justify-between">
              <span class="grid size-9 place-items-center rounded-[9px] border border-primary/25 bg-primary/15 text-[#a5a6ff]" aria-hidden="true">
                <svg v-if="feature.icon === 'chat'" class="size-5" viewBox="0 0 24 24" fill="none">
                  <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H11l-5 4v-4h-.25A2.75 2.75 0 0 1 3 13.25v-7.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                  <path d="M8 8h8M8 11.5h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <svg v-else-if="feature.icon === 'lock'" class="size-5" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" stroke-width="1.7" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <svg v-else class="size-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.7" />
                  <path d="M4 21v-1a8 8 0 0 1 16 0v1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
              </span>
              <span class="font-heading text-[11px] text-slate-500">{{ feature.number }}</span>
            </div>
            <h3 class="mb-[6px] mt-3 font-heading text-sm font-medium tracking-[-0.3px] sm:mt-[15px]">
              {{ feature.title }}
            </h3>
            <p class="max-w-[290px] text-[10px] leading-[1.7] text-muted">
              {{ feature.description }}
            </p>
          </article>
        </div>
      </section>

      <section
        class="relative flex min-h-[170px] flex-col justify-center gap-[19px] overflow-hidden rounded-[14px] border border-[#8183f5]/30 bg-[linear-gradient(110deg,rgba(99,102,241,0.2),rgba(20,184,166,0.07)_75%),#17233a] px-6 py-7 sm:min-h-[145px] sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:px-[38px]"
        aria-label="Crear una cuenta"
      >
        <div class="relative z-[1]">
          <span class="text-[9px] font-bold tracking-[1.7px] text-[#aaaaff]">HAY LUGAR PARA VOS</span>
          <h2 class="mt-[9px] font-heading text-[25px] font-medium tracking-[-1.4px] sm:text-[27px]">
            ¿Arrancamos a conversar?
          </h2>
        </div>
        <RouterLink
          v-if="isAuthReady && !user"
          class="relative z-[1] inline-flex min-h-[45px] w-fit items-center justify-center gap-4 rounded-[9px] border border-transparent bg-primary px-[17px] text-[13px] font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)]"
          to="/registrarse"
        >
          Crear mi cuenta <span aria-hidden="true">↗</span>
        </RouterLink>
        <RouterLink
          v-else-if="isAuthReady && user"
          class="relative z-[1] inline-flex min-h-[45px] w-fit items-center justify-center gap-4 rounded-[9px] border border-transparent bg-primary px-[17px] text-[13px] font-semibold text-white no-underline transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_10px_30px_rgba(79,70,229,0.23)]"
          to="/perfil"
        >
          Ver mi perfil <span aria-hidden="true">↗</span>
        </RouterLink>
        <span class="pointer-events-none absolute -right-[13px] -top-10 text-[160px] leading-none text-[#8183f5]/10 sm:right-[150px] sm:top-[-68px] sm:text-[210px]" aria-hidden="true">✳</span>
      </section>
    </div>
  </div>
</template>
