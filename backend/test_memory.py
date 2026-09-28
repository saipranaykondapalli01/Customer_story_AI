from services.memory import remember_customer, recall_customer

print("Saving customer interaction...")

remember_customer(
    "Customer Rahul reported that his delivery was 3 days late. "
    "He was unhappy and prefers email communication."
)

print("Memory saved!")

print("\nRecalling Rahul's history...")

results = recall_customer(
    "What problems has Rahul experienced and what communication method does he prefer?"
)

for memory in results.results:
    print("-", memory.text)