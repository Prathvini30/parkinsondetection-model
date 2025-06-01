
# Complete ML Implementation Guide for Parkinson's Disease Detection

## Overview
This guide provides step-by-step instructions to implement real machine learning models for Parkinson's disease detection using voice, spiral drawing, and posture analysis.

## Step 1: Set Up Development Environment

### Prerequisites
```bash
# Install Python and required packages
pip install tensorflow pandas numpy scikit-learn opencv-python librosa
pip install tensorflow-js-converter  # For converting models to TensorFlow.js

# Install Node.js packages (already done in this project)
npm install @tensorflow/tfjs
```

## Step 2: Download and Prepare Datasets

### Voice Analysis Dataset
```python
# Download Parkinson's Disease Speech Dataset
import requests
import zipfile

# UCI ML Repository - Parkinson's Speech Dataset
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/parkinsons/parkinsons.data"
response = requests.get(url)
with open('parkinsons_voice.data', 'wb') as f:
    f.write(response.content)

# Additional voice datasets
# 1. PC-GITA: http://fon.hum.uva.nl/david/ma_ml/2014/PCGITA.zip
# 2. Italian Parkinson's Voice: https://www.kaggle.com/datasets/dipayanbiswas/parkinsons-disease-speech-signal-features
```

### Spiral Drawing Dataset
```python
# Download HandPD dataset (requires registration)
# 1. Go to: https://wwwp.fc.unesp.br/~papa/pub/datasets/Handpd/
# 2. Register and download the dataset
# 3. Extract spiral and wave drawings

# Alternative: Create synthetic dataset
import numpy as np
import matplotlib.pyplot as plt

def generate_spiral_data():
    # Generate synthetic spiral data for training
    healthy_spirals = []
    parkinsons_spirals = []
    
    for i in range(1000):
        # Healthy spiral (smooth)
        t = np.linspace(0, 4*np.pi, 100)
        r = t/2
        x = r * np.cos(t) + np.random.normal(0, 0.1, 100)
        y = r * np.sin(t) + np.random.normal(0, 0.1, 100)
        healthy_spirals.append((x, y))
        
        # Parkinson's spiral (tremor added)
        tremor = np.random.normal(0, 0.5, 100)
        x_pk = r * np.cos(t) + tremor
        y_pk = r * np.sin(t) + tremor
        parkinsons_spirals.append((x_pk, y_pk))
    
    return healthy_spirals, parkinsons_spirals
```

### Posture/Gait Dataset
```python
# Download gait datasets
# 1. Daphnet Freezing of Gait: https://archive.ics.uci.edu/ml/datasets/Daphnet+Freezing+of+Gait
# 2. PHYSIONET Gait: https://physionet.org/content/gaitpdb/1.0.0/

import requests
import os

def download_gait_data():
    base_url = "https://physionet.org/files/gaitpdb/1.0.0/"
    files = ["Ga01.txt", "Ga02.txt", "Si01.txt", "Si02.txt"]  # Sample files
    
    for file in files:
        url = base_url + file
        response = requests.get(url)
        with open(f"gait_data/{file}", 'wb') as f:
            f.write(response.content)
```

## Step 3: Data Preprocessing

### Voice Feature Extraction
```python
import librosa
import numpy as np

def extract_voice_features(audio_file):
    # Load audio
    y, sr = librosa.load(audio_file)
    
    # Extract features
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)
    
    # Calculate jitter and shimmer (simplified)
    def calculate_jitter(y, sr):
        # Simplified jitter calculation
        frame_length = int(0.025 * sr)
        hop_length = int(0.01 * sr)
        frames = librosa.util.frame(y, frame_length, hop_length)
        periods = []
        for frame in frames.T:
            autocorr = np.correlate(frame, frame, mode='full')
            autocorr = autocorr[len(autocorr)//2:]
            if len(autocorr) > 1:
                period = np.argmax(autocorr[1:]) + 1
                periods.append(period)
        return np.std(periods) / np.mean(periods) if periods else 0
    
    jitter = calculate_jitter(y, sr)
    
    return {
        'mfcc': np.mean(mfcc, axis=1),
        'spectral_centroid': np.mean(spectral_centroid),
        'spectral_rolloff': np.mean(spectral_rolloff),
        'zero_crossing_rate': np.mean(zero_crossing_rate),
        'jitter': jitter
    }
```

### Spiral Image Processing
```python
import cv2
import numpy as np

def preprocess_spiral_image(image_path):
    # Load and preprocess spiral image
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    
    # Resize to standard size
    img = cv2.resize(img, (224, 224))
    
    # Apply edge detection
    edges = cv2.Canny(img, 50, 150)
    
    # Extract features
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    features = {
        'area': cv2.contourArea(contours[0]) if contours else 0,
        'perimeter': cv2.arcLength(contours[0], True) if contours else 0,
        'smoothness': calculate_smoothness(contours[0]) if contours else 0
    }
    
    return img, features

def calculate_smoothness(contour):
    # Calculate contour smoothness
    if len(contour) < 3:
        return 0
    
    angles = []
    for i in range(len(contour)):
        p1 = contour[i-1][0]
        p2 = contour[i][0]
        p3 = contour[(i+1) % len(contour)][0]
        
        v1 = p2 - p1
        v2 = p3 - p2
        
        angle = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8))
        angles.append(angle)
    
    return np.std(angles)
```

## Step 4: Model Training

### Train Voice Analysis Model
```python
import tensorflow as tf
from sklearn.model_selection import train_test_split

def train_voice_model(features, labels):
    # Prepare data
    X = np.array([f['mfcc'] for f in features])
    y = tf.keras.utils.to_categorical(labels, 4)  # 4 classes: healthy, mild, moderate, severe
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create model
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(13,)),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(16, activation='relu'),
        tf.keras.layers.Dense(4, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Train model
    history = model.fit(
        X_train, y_train,
        epochs=100,
        batch_size=32,
        validation_data=(X_test, y_test),
        verbose=1
    )
    
    return model, history

# Convert to TensorFlow.js format
def convert_to_tfjs(model, output_path):
    import tensorflowjs as tfjs
    tfjs.converters.save_keras_model(model, output_path)
```

### Train Spiral Analysis Model
```python
def train_spiral_model(images, labels):
    # Prepare data
    X = np.array(images).reshape(-1, 224, 224, 1)
    y = tf.keras.utils.to_categorical(labels, 4)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create CNN model
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 1)),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(4, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Train model
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=16,
        validation_data=(X_test, y_test),
        verbose=1
    )
    
    return model, history
```

## Step 5: Deploy Models to Web Application

### Update Model URLs
```typescript
// In src/services/ml/realSpiralAnalysis.ts
const defaultModelUrl = modelUrl || 'https://your-actual-model-storage.com/spiral-model/model.json';

// In src/services/ml/realVoiceAnalysis.ts
const defaultModelUrl = modelUrl || 'https://your-actual-model-storage.com/voice-model/model.json';

// In src/services/ml/realPostureAnalysis.ts
const defaultModelUrl = modelUrl || 'https://your-actual-model-storage.com/posture-model/model.json';
```

### Host Models
1. Upload converted TensorFlow.js models to cloud storage (AWS S3, Google Cloud Storage, etc.)
2. Update the URLs in the code
3. Ensure CORS is properly configured for your domain

## Step 6: Testing and Validation

### Model Evaluation
```python
def evaluate_model(model, X_test, y_test):
    # Predictions
    predictions = model.predict(X_test)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = np.argmax(y_test, axis=1)
    
    # Metrics
    from sklearn.metrics import classification_report, confusion_matrix
    print(classification_report(true_classes, predicted_classes))
    print(confusion_matrix(true_classes, predicted_classes))
    
    return predictions
```

## Step 7: Integration with Current Application

The current application already has the infrastructure to:
1. Load and initialize ML models
2. Process uploaded images and audio
3. Extract features and make predictions
4. Display results in a user-friendly interface

To use real models:
1. Train models using the scripts above
2. Convert to TensorFlow.js format
3. Host the models online
4. Update the model URLs in the code
5. Test with real data

## Next Steps

1. **Data Collection**: Gather more diverse and larger datasets
2. **Feature Engineering**: Improve feature extraction methods
3. **Model Optimization**: Experiment with different architectures
4. **Validation**: Test with clinical data and get medical validation
5. **Deployment**: Scale the infrastructure for production use

This implementation provides a complete pipeline from data collection to deployment for real ML-based Parkinson's disease detection.
