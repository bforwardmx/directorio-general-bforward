# Portal Directorio BForward

Portal estático para alta y edición de entidades, contactos, aliases y direcciones del directorio general de BForward.

## Archivos

- `index.html`: estructura principal del portal
- `styles.css`: estilos corporativos
- `app.js`: lógica del formulario y armado del JSON
- `Dockerfile`: imagen Nginx para despliegue
- `docker-compose.yml`: despliegue simple para Coolify
- `nginx.conf`: configuración web server

## Despliegue en Coolify

### Opción recomendada
Crear una **Application** conectada al repositorio GitHub.

### Build Pack
Usar **Docker Compose**.

### Base Directory
`/`

### Docker Compose Location
`/docker-compose.yml`

### Dominio
Asignar el dominio deseado en Coolify. El contenedor escucha en puerto `80`.

## Configuración del formulario

Dentro del portal, captura el endpoint de guardado en el bloque **Configuración**.

Ejemplo:

`https://TU-DOMINIO/webhook/directorio-entidades`

## Integración sugerida

1. HTML publica JSON al webhook.
2. n8n recibe el payload.
3. n8n ejecuta:

```sql
SELECT directorio.guardar_entidad_completa($1::jsonb);
```

## Assets corporativos

Las imágenes del portal apuntan a assets hospedados en:

- `https://bf.bforward.cloud/assets/...`

Puedes ajustar `?width=` o cambiar IDs directamente en `styles.css`.
