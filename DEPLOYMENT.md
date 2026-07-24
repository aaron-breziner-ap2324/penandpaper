# Pen & Paper — estado del deploy

## Ya está hecho ✅

- Código en GitHub: `github.com/aaron-breziner-ap2324/penandpaper`
- Publicado en Vercel, proyecto `penandpaper-8bnp`
- Base de datos real en Neon (Postgres), conectada vía `DATABASE_URL` /
  `DATABASE_URL_UNPOOLED` (esta última es necesaria para que las migraciones
  no den timeout — Neon usa un "pooler" que no las soporta)
- `AUTH_SECRET` configurado
- `RESEND_API_KEY` configurado (envío de emails de notificación)
- Cada `git push` a `main` redespliega solo

## Variables de entorno necesarias en Vercel

| Variable | De dónde sale |
|---|---|
| `DATABASE_URL` | La agrega sola la integración de Neon/Vercel Postgres |
| `DATABASE_URL_UNPOOLED` | Idem — usada como `directUrl` para migraciones |
| `AUTH_SECRET` | Generada una vez, no cambia |
| `RESEND_API_KEY` | De resend.com → API Keys |

## Pendiente: dominio propio

1. Comprá `penandpaper.com` (podés hacerlo desde el propio Vercel:
   **Settings → Domains → Buy**, o en Namecheap/GoDaddy).
2. En Vercel: **Settings → Domains → Add** → escribí `penandpaper.com`.
3. Si lo compraste afuera de Vercel, te va a mostrar los registros DNS
   (un A y un CNAME para `www`) para cargar en tu registrador.
4. Esperá que se propague el DNS — Vercel activa HTTPS solo.

## Emails (Resend)

Los emails salen de `onboarding@resend.dev` (dirección de prueba de Resend).
Mientras no haya un dominio verificado en Resend, **solo se pueden mandar
emails de verdad a la dirección con la que te registraste en Resend** — a
cualquier otra dirección Resend devuelve error 422 (no rompe la reserva, solo
no llega el mail).

Cuando tengas `penandpaper.com`, hay que:
1. Verificarlo en Resend (**Domains → Add Domain**, agregar los registros DNS
   que pide).
2. Cambiar el remitente en `src/lib/email.ts` de `onboarding@resend.dev` a
   algo como `Pen & Paper <notificaciones@penandpaper.com>`.

## Cómo se maneja el admin

No hay una cuenta admin "de fábrica". El flujo es:
1. Te registrás normal en `/registro` con tu email y tu contraseña real.
2. Le pedís a Claude (o corrés un script) que ponga `isAdmin = true` en esa
   cuenta desde la base de datos.
3. Cerrás sesión y volvés a entrar — ahí aparece el link "Admin".

## Acceso a la base de datos

Desde la carpeta del proyecto en tu compu:
```bash
npx prisma studio
```
Se abre en `http://localhost:5555`, conectado a la base real (la misma que
usa la app en producción).
