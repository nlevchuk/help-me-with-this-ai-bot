# Help Me With This

Help Me With This is an AI-powered Telegram bot that turns messages into answers. You can forward messages or reply to the bot, and it will respond to you based on the initial instructions (see OPENAI_PROMPT). The current implementation relies on ChatGPT as its language model backend.

## Use Cases

- Summarize provided content. You can either share messages from other channels or paste text directly to the bot, but keep in mind the max tokens number
- Explain a foreign word, including what it means and the contexts in which it can be applied
- Compare two or more foreign words and describe the contexts in which they are used

## What the bot does NOT store?
- Any messages from users
- Any responses from ChatGPT API

### What the bot stores?
- The user's `Telegram ID` for user identification
- LLM usage statistics:
    - Used model name (string). For example, `gpt-5`, `gpt-4.1`
    - Number of tokens in the prompt (number)
    - Number of tokens in the generated completion (number)

## Requirements

- Node.js >= 20
- [pnpm](https://pnpm.io/) >= 9
- PostgreSQL >= 17
- [OpenAI API](https://platform.openai.com/settings/organization/api-keys) key 
- Telegram Bot token (@BotFather). _For convenience, it is recommended to create two bots (keys): one for local development and one for production_
- Make (not mandatory but highly recommended)

## Installation

Fork and clone the repository

```bash
git clone git@github.com:nlevchuk/help-me-with-this-ai-bot.git
```

Install dependencies

```bash
make install
```

Configure environment variables. Copy the `.env.template` file to `.env` at the project root and supply the following variables
 
| Variable | Description |
| --- | --- |
| `OPENAI_PROMPT`* | Initial instructions for ChatGPT. This instructions define the bot's purpose and are prepended to every message before being sent to ChatGPT |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` | Bot token and username obtained from @BotFather. |
| `OPENAI_API_KEY` | API key used to call the OpenAI completions API |
| `OPENAI_MODEL`, `OPENAI_TEMPERATURE`, `OPENAI_MAX_TOKENS`, `OPENAI_TOP_P`, `OPENAI_FREQ_PENALTY`, `OPENAI_PRES_PENALTY` | Model configuration for OpenAI prompts |
| `TRANSLATION_LANGUAGES` | Comma-separated list of translation languages for the translation plugin |
| `TRANSLATION_PROMPT` | Base prompt for the translation plugin |
| `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Connection details for the PostgreSQL database |
| `POSTGRES_CA_CERT_PATH` | Path to the CA certificate |
| `HONEYBADGER_API_KEY` | Error reporting |

\* Examples of initial instructions:

- "Summarize the following text into two or three sentences"
- "Check that the following sentences are grammatically correct and sound natural in Spanish"
- "Get the main idea behind the text"

## Generate Tokens for New Users

The bot authenticates users with tokens to prevent unexpected usage. Authentication can be omitted depending on the purpose of the bot, but it is recommended when you plan to use a paid language model backend such as ChatGPT.

To add a new user, generate an invitation token link and share it with them. Run the command locally:

```bash
  make generate-invitation-link
```

You will see a link similar to `https://t.me/<YOUR_BOT_NAME>?start=<INVITATION_TOKEN>`

Then connect to the database using your preferred tool and add a new record in the `InvitationTokens` table. Use the `INVITATION_TOKEN` part from the generated link and place it in the `token` column. Additionally, you can specify extra parameters for the token:

- `allowedMultipleInvites=TRUE|FALSE` (default: FALSE)  
  Allow multiple users to connect to your bot using the token URL. When `FALSE`, the link can only be used once

- `defaultApiCallsLimit=number`   
  If set, defines the maximum number of messages a user can send through your bot per day

- `defaultMaxMessageLength=number`  
  If set, defines the maximum message length sent to your bot. The bot shows an appropriate message to the user if it exceeds the limit

- `comment=string` (max length: 256)  
  A comment to remind yourself what the token is for

## Usage

Compile the TypeScript sources:

```bash
make build
```

Run database migrations once the data source is configured:

```bash
make db-migrate
```
Rollbacks are available through `make db-rollback`.

Start the bot:

```bash
make start
```

## Deployment

Running the bot in the cloud is straightforward. The default workflow in the project uses Github Actions to build the image, push it to the container registry and roll the container out to the server.

### Provisioning with Ansible

The project uses [ansible](https://docs.ansible.com/) for the initial setup. You can either use the playbooks listed in the [repo](https://github.com/nlevchuk/server-configs/tree/main/initial-server-setup/ansible), or follow the [Lightsail instance setup](https://github.com/nlevchuk/server-configs/tree/main/initial-server-setup/lightsail). Both approaches are supported.

Next, the server should be prepared to run the bot. Use [the playbook](/ansible) in current repository for it.

Prepare necessary files:

- Copy `group_vars/all/vault.yml.template` to `group_vars/all/vault.yml` and update the `cr_token` variable. To use Github Container Registry, create a Personal Access Token with `read:packages` permission at `https://github.com/settings/tokens/new`. Store the token (starts with `ghp_***`) in `cr_token`. For security, encrypt the vault as described in the [README](https://github.com/nlevchuk/help-me-with-this-ai-bot/blob/main/ansible/README.md) file for it. Remember the password or store it in the `vault_passwd.txt` file (listed in .gitignore). But shhhh, nobody should know about it:)
- Copy `inventory.ini.template` to `inventory.ini` and replace `<IP>` and `<USERNAME>` with your server's IP address and your container registry username
- Populate the `files/` directory with: 
    - `certs/ca.pem` issued by your database provider
    - `.env` containing production environment variables
    - `.tmux.conf` (can be empty if tmux is unused)

Run the playbook from the repository root:

- From the repository root, execute `make run-ansible`. The playbook uses [podman](https://podman.io/) by default. To use docker instead, run `ansible-playbook -i ansible/inventory.ini --vault-password-file ansible/vault_passwd.txt ansible/playbook-docker.yml`

Review the output:

- Follow the final instructions printed by Ansible

### GitHub Actions secrets

Once the previos steps complete, configure the Github Actions by adding the following Secrets at <https://github.com/nlevchuk/help-me-with-this-ai-bot/settings/secrets/actions>:

  - SERVER_HOST: IP address of your server
  - SERVER_USERNAME: User that runs the app (default: ubuntu)
  - SERVER_KEY: Contents of the private SSH key, as described in the final Ansible output
  - SERVER_KNOWN_HOSTS: Contents of the `known_hosts` file mentioned in the final Ansible output

## TODO

- [ ] Describe the message translator feature and how it works (quoted messages, replied messages)
- [ ] Describe the message removal feature and how it works
- [ ] Modify the scripts/run_container.sh to ensure it terminates if any command fails (set -e)
- [ ] Add support for more LLMs
- [ ] Allow translating replies and quotes into languages other than the default on the fly; use `/translate <Language>` ([repo](https://github.com/nlevchuk/tg-message-translator))
- [ ] When the Translator plugin is enabled, show system messages in the user's language
