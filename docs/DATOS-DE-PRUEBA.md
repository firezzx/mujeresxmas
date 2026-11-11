# Datos de prueba

Contenido inventado para mostrar el sitio funcionando antes de tener el contenido real. No son migraciones:
se cargan a mano y se borran cuando ya no hacen falta.

## Qué carga

| Qué | Cantidad | Dónde se ve |
| --- | --- | --- |
| Usuarias | 8, con ciudad y emprendimiento; 3 en el plan pago | Panel de administración, avatares de "Últimas registradas" y autoras de los comentarios |
| Cursos | 6 publicados, 4 con fecha | Inicio, Mi cuenta y panel de administración |
| Encuentros | 5 entre noviembre y diciembre de 2026 | Inicio, Mi cuenta y panel de administración |
| Notas del blog | 5 publicadas, una destacada, con fotos del sitio de portada | Blog e inicio |
| Comentarios | 14 repartidos en las notas | Cada nota del blog |
| Notificaciones | 3 para todas | Panel de notificaciones |

Las administradoras quedan anotadas en 4 cursos y 3 encuentros, para que se vean en su Mi cuenta.

Las usuarias de prueba usan correos `@example.com` y no tienen contraseña: no pueden iniciar sesión.

## Cómo cargarlos

1. Abrí el SQL Editor de Supabase.
2. Pegá todo [supabase/demo/datos-de-prueba.sql](../supabase/demo/datos-de-prueba.sql) y ejecutalo.

Si se corre dos veces no duplica nada. Para empezar de cero, primero borrá los datos.

## Cómo borrarlos

Pegá [supabase/demo/borrar-datos-de-prueba.sql](../supabase/demo/borrar-datos-de-prueba.sql) en el SQL Editor y
ejecutalo. Solo borra lo de prueba: lo reconoce por los ids fijos y por los correos `.demo@example.com`.

## Cómo cambiarlos

Los textos están en [scripts/datos-de-prueba.mjs](../scripts/datos-de-prueba.mjs). Después de editarlo, se
generan los dos SQL de nuevo con:

```bash
node scripts/datos-de-prueba.mjs
```

Las portadas de las notas de prueba son fotos de `public/images/home`. Desde el admin del blog se pueden
reemplazar por imágenes subidas.
