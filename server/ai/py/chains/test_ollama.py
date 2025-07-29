from langchain_ollama import OllamaLLM
llm = OllamaLLM(model="llama3")
print(llm.invoke("Hello, what is the purpose of open source?"))
