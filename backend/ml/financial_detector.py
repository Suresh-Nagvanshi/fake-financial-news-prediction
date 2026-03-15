import pandas as pd
import logging
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Configure logging for group collaboration
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

class FinancialFakeNewsDetector:
    def __init__(self, stop_words='english', max_df=0.7):
        """
        Initializes the Stage A Detector using Passive Aggressive Classifier.
        """
        self.vectorizer = TfidfVectorizer(stop_words=stop_words, max_df=max_df)
        self.model = PassiveAggressiveClassifier(max_iter=50, random_state=42)
        self.is_trained = False

    def preprocess_data(self, df, text_col='text', label_col='label'):
        """
        Cleans and splits the dataset.
        """
        logging.info("Preprocessing data and splitting into Train/Test sets...")
        X = df[text_col].fillna('')
        y = df[label_col]
        
        return train_test_split(X, y, test_size=0.2, random_state=7)

    def train(self, x_train, y_train):
        """
        Fits the vectorizer and trains the PA Classifier.
        """
        logging.info("Vectorizing text data (TF-IDF)...")
        tfidf_train = self.vectorizer.fit_transform(x_train)
        
        logging.info("Training Passive Aggressive Classifier...")
        self.model.fit(tfidf_train, y_train)
        self.is_trained = True
        logging.info("Model training complete.")

    def evaluate(self, x_test, y_test):
        """
        Evaluates model performance and returns metrics.
        """
        if not self.is_trained:
            raise Exception("Model must be trained before evaluation.")

        tfidf_test = self.vectorizer.transform(x_test)
        y_pred = self.model.predict(tfidf_test)
        
        metrics = {
            "accuracy": accuracy_score(y_test, y_pred),
            "confusion_matrix": confusion_matrix(y_test, y_pred, labels=['Fake', 'Real']),
            "report": classification_report(y_test, y_pred)
        }
        return metrics

    def predict_single(self, text):
        """
        Predicts a single news snippet (Useful for the UI/API).
        """
        tfidf_input = self.vectorizer.transform([text])
        prediction = self.model.predict(tfidf_input)
        return prediction[0]

# --- Example Usage for the Group ---
if __name__ == "__main__":
    # 1. Load Data
    try:
        data = pd.read_csv('financial_news.csv') 
        
        # 2. Initialize Detector
        detector = FinancialFakeNewsDetector()
        
        # 3. Process & Train
        X_train, X_test, Y_train, Y_test = detector.preprocess_data(data)
        detector.train(X_train, Y_train)
        
        # 4. Show Results
        results = detector.evaluate(X_test, Y_test)
        print(f"\n--- Model Results ---\nAccuracy: {results['accuracy']:.2%}")
        print("\nClassification Report:\n", results['report'])
        
    except FileNotFoundError:
        logging.error("Dataset file not found. Please ensure 'financial_news.csv' exists.")