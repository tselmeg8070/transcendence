all:
	docker-compose -f docker-compose.yml up -d --build

down:
	docker-compose -f docker-compose.yml down

re:
	docker-compose -f docker-compose.yml up -d --build

clean: down
	docker system prune -a

.PHONY: all re down clean
