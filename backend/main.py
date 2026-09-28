from fastapi import FastAPI
from pydantic import BaseModel
import os
from groq import Groq
from services.memory import remember_customer, recall_customer

app = FastAPI(title="CustomerStory AI")
groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

class CustomerMessage(BaseModel):
    customer_name: str
    message: str


@app.get("/")
def home():
    return {
        "message": "CustomerStory AI backend is running!"
    }


@app.post("/customer/message")
def save_customer_message(data: CustomerMessage):

    interaction = (
        f"Customer {data.customer_name} said: {data.message}"
    )

    remember_customer(interaction)

    return {
        "message": "Customer interaction saved successfully!",
        "customer": data.customer_name
    }


@app.get("/customer/{customer_name}/history")
def get_customer_history(customer_name: str):

    query = f"What do I know about customer {customer_name}?"

    results = recall_customer(query)

    memories = []

    for memory in results.results:
        memories.append(memory.text)

    return {
        "customer": customer_name,
        "history": memories
    }
@app.get("/customer/{customer_name}/summary")
def get_customer_summary(customer_name: str):

    query = f"What is the complete story of customer {customer_name}?"

    results = recall_customer(query)

    memories = []

    for memory in results.results:
        memories.append(memory.text)

    memory_text = "\n".join(memories)

    prompt = f"""
You are a customer support assistant.

Create a short, clear customer story from the information below.

Customer: {customer_name}

Memory:
{memory_text}

Include:
- important past problems
- what made the customer unhappy
- preferences
- recent issues

Do not invent any information.
Keep the answer to 3-4 sentences.
"""

    response = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    summary = response.choices[0].message.content

    return {
        "customer": customer_name,
        "summary": summary
    }