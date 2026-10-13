# Nexo

Aplicación SPA de comunidad construida con Vue, Vite, Tailwind y Supabase.

## Requisitos

- Node.js
- pnpm
- Un proyecto de Supabase con Auth, Postgres y Realtime habilitados

## Instalación

```bash
pnpm install
cp .env.example .env
```

Completá `.env` con las credenciales públicas del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_KEY=tu_clave_publica
```

## Base de datos

Para aplicar las migraciones en un proyecto remoto:

```bash
npx supabase login
npx supabase link --project-ref TU_PROJECT_REF
npx supabase db push
```

El `PROJECT_REF` es el identificador del proyecto sin `https://` ni `.supabase.co`.

Si las tablas iniciales ya fueron creadas manualmente, marcá esas migraciones como aplicadas antes de ejecutar `db push`. No uses `db reset` contra un proyecto remoto.

## Desarrollo

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Rutas principales

- `/registrarse`: crear una cuenta.
- `/inicio-sesion`: iniciar sesión.
- `/feed`: publicaciones de la comunidad.
- `/perfil`: editar el perfil propio.
- `/usuario/:id`: perfil público y publicaciones.
- `/chat`: chat global.
- `/chat/:id`: conversación privada.