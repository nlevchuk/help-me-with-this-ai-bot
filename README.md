## Help Me With This

Help Me With This is an AI-powered Telegram bot that turns messages into answers. Currently supported ChatGPT.


### Use Cases

- FIXME

### Install

1. **Prerequisites**
   - Node.js 20+
   - [pnpm](https://pnpm.io/) 9+
   - PostgreSQL
   - OpenAI API key and Telegram Bot token
2. **Clone and install**
   ```bash
   pnpm install
   ```
3. **Environment variables**
   Create an `.env` file at the project root and supply the following variables:
   
   | Variable | Description |
   | --- | --- |
   | `TELEGRAM_BOT_TOKEN` | Bot token obtained from BotFather. |
   | `OPENAI_API_KEY` | API key used to call the OpenAI completions API. |
   | `OPENAI_MODEL`, `OPENAI_TEMPERATURE`, `OPENAI_MAX_TOKENS`, `OPENAI_TOP_P`, `OPENAI_FREQ_PENALTY`, `OPENAI_PRES_PENALTY`, `OPENAI_PROMPT` | Model configuration for AI prompts. |
   | `TRANSLATION_LANGUAGES`, `TRANSLATION_PROMPT` | Comma-separated list of translation languages and base prompt for the translation plugin. |
   | `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Connection details for the PostgreSQL database. |
   | `POSTGRES_CA_CERT_PATH` | Path (inside the container or local runtime) to the CA certificate that signs the database TLS connection. |
   | `HONEYBADGER_API_KEY` and related Honeybadger env vars (optional) | Enables production error reporting. |

### Generate New Invitation Token

To add new user you need to generate an invitation token and share it with the user. Run the command on the server or locally:
```bash
  bash ./scripts/generate-invitation-link.sh
```

You get a link similar to
```
https://t.me/<YOUR_BOT_NAME>?start=<INVITATION_TOKEN>
```

Then you need to connect to the database using any database tool you use and add a new record in the InvitationTokens table. Use the INVITATION_TOKEN part from the resulted link while adding the record. Additionally, you can specify extra parameters for the token:
- `allowedMultipleInvites=TRUE|FALSE` (default: FALSE)
  Allow multiple users to connect to your bot using the token. When its value is `FALSE`, the link can only be used once.
- `defaultApiCallsLimit=number` 
  FIXME
- `defaultMaxMessageLength=number`
  FIXME
- `comment=text`
  FIXME

### Usage

- Compile the TypeScript sources:
  ```bash
  pnpm run build
  ```
- Start the bot in development:
  ```bash
  pnpm start
  ```
- Run database migrations once the datasource is configured:
  ```bash
  pnpm run db:migrate
  ```
  Rollbacks are available through `pnpm run db:rollback`.

### Deployment

- **Docker**: Build and run an image with the included `Dockerfile` and Makefile helpers.
  If you intend to run the container on your own server with Docker or Podman, follow the rest of this section.
  ```bash
  make build
  make run
  ```
  Mount the `./logs` directory if you need to retain log files between server reprovisioning, and mount `./certs` so the bot can access database TLS certificates.
- **Ansible**: Provision remote infrastructure with `make run-ansible`, which executes `ansible/playbook.yml` using the inventory and vaulted secrets under `ansible/`. Supply a GitHub token created under **GitHub ▸ Settings ▸ Developer settings ▸ Personal access tokens** in `ansible/group_vars/all/vault.yml` as `cr_token`; the playbook uses this token to authenticate with the container registry. Keep the vault file encrypted (see `ansible/README.md`), and populate `ansible/files/` with the following before running the playbook:
  - `certs/ca.pem` issued by your database provider
  - `.env` containing production environment variables
  - `.tmux.conf` (can be empty if tmux is unused)

  Additionally, copy `ansible/inventory.ini.template` to `ansible/inventory.ini`, add your server's IP address or domain, and set the container registry username used to store the image.
- The production process registers signal handlers to gracefully stop the grammY runner.
- By default, the deployment workflow uses Podman as the container engine. To use Docker instead, run the `playbook-docker.yml` playbook and enable the `run-docker-container` script in the GitHub workflows.
