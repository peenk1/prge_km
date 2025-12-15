# prge_km
prge demo app for students


### how to start

```bash
docker-compose -f ./docker-compose/docker-compose-prge-local.yml --env-file .env -p local-prge up --build -d
```
```bash
docker system prune -a -f
```
```bash
docker system prune --volumes
```