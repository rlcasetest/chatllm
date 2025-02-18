# ChatLLM

A lightweight project to run a full-stack application using Supabase, Docker, and FastAPI.

---

## Install / Setup

These instructions are aimed at **Linux** and **MacOS** environments.  
If you are using **Windows**, please install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or use the alternative commands required for the steps below.

Ensure you have the following installed:

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Either [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) **or** the [Supabase CLI](https://supabase.com/docs/guides/local-development)

> **Note:** This project requires Supabase version 3 or above. You can verify your version with:
>
> ```shell
> npx supabase -v
> ```

---

## Cloning and External Dependencies Setup

Clone the repository and set up external dependencies:

```shell
git clone https://github.com/rlcasetest/chatllm
cd challm

# Start Supabase containers and apply SQL seed (sets up the `history` table)
npx supabase start  # or `supabase start`

# Start Ollama via Docker Compose
docker compose up -d
```

---

## Environment Variables

Both the `backend/` and `frontend/` directories require a `.env` file. Refer to `.env.example` for guidance.

### Setup Steps

1. **Frontend:**

   ```shell
   cd frontend
   cp .env.example .env
   # Edit `.env` with the values from `npx supabase start`
   ```

2. **Backend:**
   ```shell
   cd backend
   cp .env.example .env
   # Edit `.env` with the values from `npx supabase start`
   ```

---

## Backend Setup

Ensure you have [Python](https://www.python.org/downloads/) and [virtualenv](https://virtualenv.pypa.io/en/latest/user_guide.html) installed.

### Steps:

1. Navigate to the backend directory:

   ```shell
   cd backend
   ```

2. Set up the virtual environment:

   ```shell
   virtualenv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. Run the project in development mode:
   ```shell
   fastapi dev basf/main.py
   ```
   > For production, use:
   >
   > ```shell
   > fastapi run basf/main.py
   > ```

---

## Frontend Setup

Ensure you have **npm** installed as mentioned earlier.

### Steps:

1. Navigate to the frontend directory:

   ```shell
   cd frontend
   ```

2. Install dependencies and run the project:
   ```shell
   npm install
   npm run dev
   ```

---

## Final Considerations

- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- Upon access, you will be redirected to the **/login** page.
- Create an account (no email confirmation required).
- Once logged in, you'll have access to the **/history** page where you can chat with the AI bot.
