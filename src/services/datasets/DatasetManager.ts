import * as tf from '@tensorflow/tfjs';

export interface DatasetSample {
  id: string;
  data: string; // base64 for images, blob URL for audio
  label: 'healthy' | 'mild' | 'moderate' | 'severe';
  features?: any;
}

export interface Dataset {
  train: DatasetSample[];
  test: DatasetSample[];
  validation: DatasetSample[];
}

export class DatasetManager {
  private datasets: {
    spiral: Dataset | null;
    voice: Dataset | null;
    posture: Dataset | null;
  } = {
    spiral: null,
    voice: null,
    posture: null
  };

  async loadAllDatasets(): Promise<boolean> {
    try {
      console.log('Loading all datasets...');
      
      // Load datasets in parallel
      const [spiralLoaded, voiceLoaded, postureLoaded] = await Promise.all([
        this.loadSpiralDataset(),
        this.loadVoiceDataset(),
        this.loadPostureDataset()
      ]);

      return spiralLoaded && voiceLoaded && postureLoaded;
    } catch (error) {
      console.error('Failed to load datasets:', error);
      return false;
    }
  }

  async loadSpiralDataset(): Promise<boolean> {
    try {
      // Generate synthetic spiral dataset with realistic patterns
      const dataset: Dataset = {
        train: [],
        test: [],
        validation: []
      };

      // Generate samples for each category
      const categories: Array<'healthy' | 'mild' | 'moderate' | 'severe'> = ['healthy', 'mild', 'moderate', 'severe'];
      
      for (const category of categories) {
        // Generate training samples (60%)
        for (let i = 0; i < 50; i++) {
          dataset.train.push({
            id: `spiral_train_${category}_${i}`,
            data: this.generateSpiralImage(category),
            label: category
          });
        }

        // Generate test samples (25%)
        for (let i = 0; i < 20; i++) {
          dataset.test.push({
            id: `spiral_test_${category}_${i}`,
            data: this.generateSpiralImage(category),
            label: category
          });
        }

        // Generate validation samples (15%)
        for (let i = 0; i < 15; i++) {
          dataset.validation.push({
            id: `spiral_val_${category}_${i}`,
            data: this.generateSpiralImage(category),
            label: category
          });
        }
      }

      this.datasets.spiral = dataset;
      console.log(`Loaded spiral dataset: ${dataset.train.length} train, ${dataset.test.length} test, ${dataset.validation.length} validation`);
      return true;
    } catch (error) {
      console.error('Failed to load spiral dataset:', error);
      return false;
    }
  }

  async loadVoiceDataset(): Promise<boolean> {
    try {
      // Generate synthetic voice dataset
      const dataset: Dataset = {
        train: [],
        test: [],
        validation: []
      };

      const categories: Array<'healthy' | 'mild' | 'moderate' | 'severe'> = ['healthy', 'mild', 'moderate', 'severe'];
      
      for (const category of categories) {
        // Generate training samples
        for (let i = 0; i < 40; i++) {
          dataset.train.push({
            id: `voice_train_${category}_${i}`,
            data: this.generateVoiceAudio(category),
            label: category
          });
        }

        // Generate test samples
        for (let i = 0; i < 15; i++) {
          dataset.test.push({
            id: `voice_test_${category}_${i}`,
            data: this.generateVoiceAudio(category),
            label: category
          });
        }

        // Generate validation samples
        for (let i = 0; i < 10; i++) {
          dataset.validation.push({
            id: `voice_val_${category}_${i}`,
            data: this.generateVoiceAudio(category),
            label: category
          });
        }
      }

      this.datasets.voice = dataset;
      console.log(`Loaded voice dataset: ${dataset.train.length} train, ${dataset.test.length} test, ${dataset.validation.length} validation`);
      return true;
    } catch (error) {
      console.error('Failed to load voice dataset:', error);
      return false;
    }
  }

  async loadPostureDataset(): Promise<boolean> {
    try {
      // Generate synthetic posture dataset
      const dataset: Dataset = {
        train: [],
        test: [],
        validation: []
      };

      const categories: Array<'healthy' | 'mild' | 'moderate' | 'severe'> = ['healthy', 'mild', 'moderate', 'severe'];
      
      for (const category of categories) {
        // Generate training samples
        for (let i = 0; i < 45; i++) {
          dataset.train.push({
            id: `posture_train_${category}_${i}`,
            data: this.generatePostureImage(category),
            label: category
          });
        }

        // Generate test samples
        for (let i = 0; i < 18; i++) {
          dataset.test.push({
            id: `posture_test_${category}_${i}`,
            data: this.generatePostureImage(category),
            label: category
          });
        }

        // Generate validation samples
        for (let i = 0; i < 12; i++) {
          dataset.validation.push({
            id: `posture_val_${category}_${i}`,
            data: this.generatePostureImage(category),
            label: category
          });
        }
      }

      this.datasets.posture = dataset;
      console.log(`Loaded posture dataset: ${dataset.train.length} train, ${dataset.test.length} test, ${dataset.validation.length} validation`);
      return true;
    } catch (error) {
      console.error('Failed to load posture dataset:', error);
      return false;
    }
  }

  private generateSpiralImage(category: 'healthy' | 'mild' | 'moderate' | 'severe'): string {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 224, 224);

    // Draw spiral with disease-specific characteristics
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerX = 112;
    const centerY = 112;
    const maxRadius = 80;
    const turns = 3;

    // Disease-specific parameters
    let tremor = 0;
    let irregularity = 0;
    let lineVariation = 1;

    switch (category) {
      case 'healthy':
        tremor = 0;
        irregularity = 0;
        lineVariation = 1;
        break;
      case 'mild':
        tremor = 2;
        irregularity = 1;
        lineVariation = 1.2;
        break;
      case 'moderate':
        tremor = 5;
        irregularity = 3;
        lineVariation = 1.5;
        break;
      case 'severe':
        tremor = 10;
        irregularity = 6;
        lineVariation = 2;
        break;
    }

    // Generate spiral points with disease characteristics
    for (let angle = 0; angle < turns * 2 * Math.PI; angle += 0.1) {
      const radius = (angle / (turns * 2 * Math.PI)) * maxRadius;
      
      // Add tremor (random noise)
      const tremorX = tremor > 0 ? (Math.random() - 0.5) * tremor : 0;
      const tremorY = tremor > 0 ? (Math.random() - 0.5) * tremor : 0;
      
      // Add irregularity (systematic deviations)
      const irregX = irregularity > 0 ? Math.sin(angle * 5) * irregularity : 0;
      const irregY = irregularity > 0 ? Math.cos(angle * 7) * irregularity : 0;
      
      const x = centerX + radius * Math.cos(angle) + tremorX + irregX;
      const y = centerY + radius * Math.sin(angle) + tremorY + irregY;
      
      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Vary line width for pressure simulation
      if (category !== 'healthy') {
        ctx.lineWidth = 1 + Math.random() * lineVariation;
      }
    }

    ctx.stroke();
    return canvas.toDataURL();
  }

  private generateVoiceAudio(category: 'healthy' | 'mild' | 'moderate' | 'severe'): string {
    // Generate synthetic audio data representing different voice patterns
    const sampleRate = 22050;
    const duration = 3; // 3 seconds
    const samples = sampleRate * duration;
    const audioData = new Float32Array(samples);

    // Base frequency for voice
    let baseFreq = 150; // Hz
    let jitter = 0;
    let shimmer = 0;
    let noiseLevel = 0;

    switch (category) {
      case 'healthy':
        jitter = 0.01;
        shimmer = 0.02;
        noiseLevel = 0.01;
        break;
      case 'mild':
        jitter = 0.05;
        shimmer = 0.08;
        noiseLevel = 0.05;
        break;
      case 'moderate':
        jitter = 0.12;
        shimmer = 0.15;
        noiseLevel = 0.12;
        break;
      case 'severe':
        jitter = 0.25;
        shimmer = 0.30;
        noiseLevel = 0.25;
        break;
    }

    // Generate audio signal with disease characteristics
    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      
      // Add jitter (frequency variation)
      const freq = baseFreq * (1 + (Math.random() - 0.5) * jitter);
      
      // Add shimmer (amplitude variation)
      const amplitude = 0.5 * (1 + (Math.random() - 0.5) * shimmer);
      
      // Generate main signal
      const signal = amplitude * Math.sin(2 * Math.PI * freq * time);
      
      // Add noise
      const noise = (Math.random() - 0.5) * noiseLevel;
      
      audioData[i] = signal + noise;
    }

    // Convert to base64 (simplified representation)
    return `data:audio/wav;base64,${btoa(String.fromCharCode(...new Uint8Array(audioData.buffer)))}`;
  }

  private generatePostureImage(category: 'healthy' | 'mild' | 'moderate' | 'severe'): string {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 224, 224);

    // Draw stick figure with posture characteristics
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;

    // Disease-specific posture parameters
    let forwardHead = 0;
    let shoulderAsymmetry = 0;
    let spinalCurvature = 0;
    let armPosition = 0;

    switch (category) {
      case 'healthy':
        forwardHead = 0;
        shoulderAsymmetry = 0;
        spinalCurvature = 0;
        armPosition = 0;
        break;
      case 'mild':
        forwardHead = 5;
        shoulderAsymmetry = 3;
        spinalCurvature = 2;
        armPosition = 2;
        break;
      case 'moderate':
        forwardHead = 12;
        shoulderAsymmetry = 8;
        spinalCurvature = 6;
        armPosition = 5;
        break;
      case 'severe':
        forwardHead = 20;
        shoulderAsymmetry = 15;
        spinalCurvature = 12;
        armPosition = 10;
        break;
    }

    // Draw head (affected by forward head posture)
    const headX = 112 + forwardHead;
    const headY = 40;
    ctx.beginPath();
    ctx.arc(headX, headY, 15, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw spine (affected by curvature)
    ctx.beginPath();
    ctx.moveTo(112, 55);
    ctx.quadraticCurveTo(112 + spinalCurvature, 100, 112, 150);
    ctx.stroke();

    // Draw shoulders (asymmetric)
    ctx.beginPath();
    ctx.moveTo(85, 70 + shoulderAsymmetry);
    ctx.lineTo(139, 70);
    ctx.stroke();

    // Draw arms (affected by rigidity)
    ctx.beginPath();
    ctx.moveTo(85, 70 + shoulderAsymmetry);
    ctx.lineTo(70 - armPosition, 110);
    ctx.moveTo(139, 70);
    ctx.lineTo(154 + armPosition, 110);
    ctx.stroke();

    // Draw legs
    ctx.beginPath();
    ctx.moveTo(112, 150);
    ctx.lineTo(95, 200);
    ctx.moveTo(112, 150);
    ctx.lineTo(129, 200);
    ctx.stroke();

    return canvas.toDataURL();
  }

  getDataset(type: 'spiral' | 'voice' | 'posture'): Dataset | null {
    return this.datasets[type];
  }

  getDatasetStats(type: 'spiral' | 'voice' | 'posture'): {
    total: number;
    train: number;
    test: number;
    validation: number;
    distribution: Record<string, number>;
  } | null {
    const dataset = this.datasets[type];
    if (!dataset) return null;

    const distribution: Record<string, number> = {};
    
    // Count labels across all splits
    [...dataset.train, ...dataset.test, ...dataset.validation].forEach(sample => {
      distribution[sample.label] = (distribution[sample.label] || 0) + 1;
    });

    return {
      total: dataset.train.length + dataset.test.length + dataset.validation.length,
      train: dataset.train.length,
      test: dataset.test.length,
      validation: dataset.validation.length,
      distribution
    };
  }

  async prepareTrainingData(type: 'spiral' | 'voice' | 'posture'): Promise<{
    trainX: tf.Tensor;
    trainY: tf.Tensor;
    testX: tf.Tensor;
    testY: tf.Tensor;
  } | null> {
    const dataset = this.datasets[type];
    if (!dataset) return null;

    try {
      // Convert labels to one-hot encoding
      const labelToIndex = { 'healthy': 0, 'mild': 1, 'moderate': 2, 'severe': 3 };
      
      // Prepare training data
      const trainFeatures = [];
      const trainLabels = [];
      
      for (const sample of dataset.train) {
        if (type === 'spiral' || type === 'posture') {
          // Process image data
          const tensor = await this.imageToTensor(sample.data);
          trainFeatures.push(tensor);
        } else {
          // Process audio data (simplified)
          const features = new Array(128).fill(0).map(() => Math.random());
          trainFeatures.push(tf.tensor1d(features));
        }
        
        const label = new Array(4).fill(0);
        label[labelToIndex[sample.label]] = 1;
        trainLabels.push(tf.tensor1d(label));
      }
      
      // Prepare test data
      const testFeatures = [];
      const testLabels = [];
      
      for (const sample of dataset.test) {
        if (type === 'spiral' || type === 'posture') {
          const tensor = await this.imageToTensor(sample.data);
          testFeatures.push(tensor);
        } else {
          const features = new Array(128).fill(0).map(() => Math.random());
          testFeatures.push(tf.tensor1d(features));
        }
        
        const label = new Array(4).fill(0);
        label[labelToIndex[sample.label]] = 1;
        testLabels.push(tf.tensor1d(label));
      }
      
      return {
        trainX: tf.stack(trainFeatures),
        trainY: tf.stack(trainLabels),
        testX: tf.stack(testFeatures),
        testY: tf.stack(testLabels)
      };
    } catch (error) {
      console.error('Failed to prepare training data:', error);
      return null;
    }
  }

  private async imageToTensor(imageData: string): Promise<tf.Tensor> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 224;
        canvas.height = 224;
        ctx.drawImage(img, 0, 0, 224, 224);
        
        const tensor = tf.browser.fromPixels(canvas)
          .toFloat()
          .div(255.0);
        resolve(tensor);
      };
      img.src = imageData;
    });
  }
}

export const datasetManager = new DatasetManager();