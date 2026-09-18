CONTAINER := su-fff-website-db-1
DB_USER := yion
DB_NAME := voteapp

dev:
	uv run uvicorn app.main:app --reload --port 8000

db-shell:
	docker exec -it $(CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)
	
db-exec:
	docker exec -it $(CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) -c "$(SQL)"