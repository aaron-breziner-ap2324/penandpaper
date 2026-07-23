# Publicar Pen & Paper en penandpaper.com

Esta guía es para publicar la app en internet con tu propio dominio. El código ya está
listo (`npm run build` corre las migraciones automáticamente); estos son los pasos que
te tocan a vos porque implican crear cuentas o pagar servicios externos.

## 1. Subir el código a GitHub

```bash
cd ~/Developer/red-de-tutores
git add -A
git commit -m "Primer commit: Pen & Paper"
```

Después creá un repositorio en https://github.com/new (puede ser privado) y conectalo:

```bash
git remote add origin https://github.com/TU-USUARIO/pen-and-paper.git
git branch -M main
git push -u origin main
```

## 2. Crear cuenta en Vercel y conectar el repo

1. Entrá a https://vercel.com y creá una cuenta (podés usar tu cuenta de GitHub).
2. "Add New... → Project" y elegí el repositorio que acabás de subir.
3. Framework: Vercel detecta Next.js automáticamente. No cambies nada todavía, solo
   dale "Deploy" (va a fallar porque falta la base de datos — es esperado).

## 3. Crear la base de datos (Postgres)

La app usa SQLite en tu compu, pero en internet necesita una base de datos real.

1. En tu proyecto de Vercel: pestaña **Storage → Create Database → Postgres**
   (usa Neon por debajo, tiene plan gratis).
2. Cuando la crees, Vercel agrega automáticamente la variable `DATABASE_URL` al
   proyecto.
3. Copiá esa `DATABASE_URL` y pasámela — yo cambio el proyecto de SQLite a Postgres
   y genero las migraciones para esa base (es un paso rápido, pero necesito la URL
   real para hacerlo).

## 4. Variables de entorno en Vercel

En **Settings → Environment Variables** agregá:

- `DATABASE_URL` → ya la agregó Vercel Postgres solo
- `AUTH_SECRET` → generá una con `openssl rand -base64 32` en tu terminal y pegala

## 5. Comprar penandpaper.com

Podés comprarlo directo desde Vercel (**Settings → Domains → Buy**) o en un
registrador como Namecheap/GoDaddy. Si lo comprás afuera de Vercel:

1. En Vercel: **Settings → Domains → Add** → escribí `penandpaper.com`
2. Vercel te muestra los registros DNS que tenés que cargar en tu registrador
   (normalmente un registro A y uno CNAME para `www`).
3. Esperá unos minutos/horas a que se propague el DNS — Vercel te avisa cuando
   quede activo con HTTPS automático.

## 6. Después del primer deploy real

- Cambiá la contraseña de tu cuenta admin (`aaronbreziner@gmail.com` /
  `PenPaper2026!`) — no hay pantalla para esto todavía, así que decime y te agrego
  un endpoint para cambiarla, o la cambio yo por una que me pases.
- Revisá que el número de WhatsApp (+507 6751-2164) siga siendo el correcto en
  `src/lib/whatsapp.ts`.

## Qué NO hice yo (porque son acciones tuyas)

- No compré ningún dominio ni creé cuentas en Vercel/GitHub/Neon — esas cuentas y
  pagos son tuyos.
- No cambié la base de datos de SQLite a Postgres todavía — lo hago apenas me
  pases la `DATABASE_URL` real, para no dejarte sin poder probar la app en tu
  compu mientras tanto.
