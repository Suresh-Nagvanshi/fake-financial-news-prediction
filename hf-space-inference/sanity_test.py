import json
from collections import Counter
from urllib import request

INFERENCE_URL = "https://sureshnagvanshi-finverify-inference.hf.space/predict"

TEST_CASES = [
    {
        "label": "Real",
        "text": "The Federal Reserve announced it will keep interest rates unchanged, citing steady inflation and moderate economic growth.",
    },
    {
        "label": "Real",
        "text": "Reliance Industries reported a rise in quarterly profits due to strong performance in its telecom and retail divisions.",
    },
    {
        "label": "Real",
        "text": "The company reported strong quarterly earnings and revenue growth.",
    },
    {
        "label": "Fake",
        "text": "An unknown company claims it has discovered a method to double stock market profits overnight without any losses.",
    },
    {
        "label": "Fake",
        "text": "A secret cryptocurrency investment guarantees 200% returns within 24 hours with zero risk, according to insiders.",
    },
    {
        "label": "Fake",
        "text": "Bitcoin to reach $500,000 by end of month as secret government deal guarantees massive price surge for all holders.",
    },
]

def predict(text: str):
    payload = json.dumps({"text": text}).encode("utf-8")
    api_request = request.Request(
        INFERENCE_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(api_request, timeout=120) as response:
        return json.loads(response.read().decode("utf-8"))

def main():
    matches = 0
    predicted = Counter()
    expected = Counter()

    for index, case in enumerate(TEST_CASES, start=1):
        result = predict(case["text"])
        predicted_label = result["prediction"]
        expected_label = case["label"]
        is_match = predicted_label == expected_label

        expected[expected_label] += 1
        predicted[predicted_label] += 1
        matches += int(is_match)

        print(f"{index}. expected={expected_label} predicted={predicted_label} confidence={result['confidence']}")
        print(f"   text: {case['text']}")

    print("\nSummary")
    print(f"Accuracy: {matches}/{len(TEST_CASES)}")
    print(f"Expected labels: {dict(expected)}")
    print(f"Predicted labels: {dict(predicted)}")

if __name__ == "__main__":
    main()