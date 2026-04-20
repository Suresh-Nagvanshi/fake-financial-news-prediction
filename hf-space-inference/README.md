---
title: Finverify Inference
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# Finverify Inference API

This Space hosts the DistilBERT inference API for the Finverify fake financial news detection model.

The API loads the saved checkpoint from `distilbert_model_cpu`, applies the tuned fake threshold, and returns prediction confidence and sentiment.