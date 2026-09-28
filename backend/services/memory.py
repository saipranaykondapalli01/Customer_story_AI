from hindsight_client import Hindsight

client = Hindsight(
    base_url="http://localhost:8888"
)

BANK_ID = "customer-story"


def remember_customer(interaction: str):
    return client.retain(
        bank_id=BANK_ID,
        content=interaction,
        context="customer support interaction"
    )


def recall_customer(query: str):
    return client.recall(
        bank_id=BANK_ID,
        query=query
    )