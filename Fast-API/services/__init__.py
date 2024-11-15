import joblib


class PredictionService:
    def __init__(self):
        self.model = joblib.load("models/iris_model.pkl")

    def predict(self, data):
        return self.model.predict(data)
