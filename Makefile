r: install build start

install:
	pnpm install

build:
	pnpm build

start:
	pnpm start

build-image:
	DOCKER_BUILDKIT=1 docker build -t hmwt .

run-container:
	docker run -it --name hmwt --env-file ./.env --volume ./logs:/app/logs --volume ./certs:/app/certs hmwt

run-bash:
	docker run -it --name hmwt --env-file ./.env hmwt /bin/bash

exec-bash:
	docker exec -it hmwt /bin/bash

stop-container:
	docker stop hmwt

rm-container:
	docker rm hmwt

rm-image:
	docker rmi hmwt

rebuild: rm-container rm-image build-image

db-migrate:
	pnpm run db:migrate

db-rollback:
	pnpm run db:rollback

generate-invitation-link:
	bash ./scripts/generate-invitation-link.sh

run-ansible:
	ansible-playbook -i ansible/inventory.ini --vault-password-file ansible/vault_passwd.txt ansible/playbook-podman.yml
