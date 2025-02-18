from basf.config import env
from basf.prompt import prompt
from ollama import ChatResponse, Client

client = Client(host=env["OLLAMA_URL"])


def ask_ai(message: str):
    response: ChatResponse = client.chat(
        model="llama3.2",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": message},
        ],
    )

    return response.message.content
