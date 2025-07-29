from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.llms import Ollama

app = FastAPI()
llm = Ollama(model="llama3")

class PromptInput(BaseModel):
    prompt: str
    content: str

@app.post("/generic-prompt")
def generic_prompt_api(data: PromptInput):
    final_prompt = f"{data.prompt.strip()}\n\n---\n{data.content}"
    return {"result": llm.invoke(final_prompt)}

