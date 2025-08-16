import * as tf from '@tensorflow/tfjs';
import { datasetManager } from '../datasets/DatasetManager';

export interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  accuracy: number;
  valLoss?: number;
  valAccuracy?: number;
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
}

export class ModelTrainer {
  private isTraining = false;

  async trainModel(
    type: 'spiral' | 'voice' | 'posture',
    config: TrainingConfig,
    onProgress?: (progress: TrainingProgress) => void
  ): Promise<tf.LayersModel | null> {
    if (this.isTraining) {
      throw new Error('Training already in progress');
    }

    try {
      this.isTraining = true;
      console.log(`Starting training for ${type} model...`);

      // Prepare training data
      const trainingData = await datasetManager.prepareTrainingData(type);
      if (!trainingData) {
        throw new Error('Failed to prepare training data');
      }

      // Create model architecture based on type
      const model = this.createModelArchitecture(type);

      // Compile model
      model.compile({
        optimizer: tf.train.adam(config.learningRate),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      console.log(`Model architecture for ${type}:`);
      model.summary();

      // Training callbacks
      const callbacks = [];
      
      if (onProgress) {
        callbacks.push({
          onEpochEnd: async (epoch: number, logs: any) => {
            onProgress({
              epoch: epoch + 1,
              totalEpochs: config.epochs,
              loss: logs?.loss || 0,
              accuracy: logs?.acc || 0,
              valLoss: logs?.val_loss,
              valAccuracy: logs?.val_acc
            });
          }
        } as any);
      }

      // Train the model
      const history = await model.fit(trainingData.trainX, trainingData.trainY, {
        epochs: config.epochs,
        batchSize: config.batchSize,
        validationData: [trainingData.testX, trainingData.testY],
        callbacks,
        verbose: 1
      });

      console.log(`Training completed for ${type} model`);
      
      // Evaluate model
      const evaluation = model.evaluate(trainingData.testX, trainingData.testY);
      const evalResults = Array.isArray(evaluation) ? evaluation : [evaluation];
      const testLoss = await (evalResults[0] as tf.Scalar).data();
      const testAccuracy = await (evalResults[1] as tf.Scalar).data();
      
      console.log(`Final test loss: ${testLoss[0].toFixed(4)}`);
      console.log(`Final test accuracy: ${testAccuracy[0].toFixed(4)}`);

      // Clean up tensors
      trainingData.trainX.dispose();
      trainingData.trainY.dispose();
      trainingData.testX.dispose();
      trainingData.testY.dispose();

      return model;
    } catch (error) {
      console.error(`Training failed for ${type}:`, error);
      return null;
    } finally {
      this.isTraining = false;
    }
  }

  private createModelArchitecture(type: 'spiral' | 'voice' | 'posture'): tf.LayersModel {
    switch (type) {
      case 'spiral':
      case 'posture':
        return this.createCNNModel();
      case 'voice':
        return this.createAudioModel();
      default:
        throw new Error(`Unknown model type: ${type}`);
    }
  }

  private createCNNModel(): tf.LayersModel {
    // CNN for image analysis (spiral/posture)
    const model = tf.sequential({
      layers: [
        // First conv block
        tf.layers.conv2d({
          inputShape: [224, 224, 3],
          filters: 32,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.batchNormalization(),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.dropout({ rate: 0.25 }),

        // Second conv block
        tf.layers.conv2d({
          filters: 64,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.batchNormalization(),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.dropout({ rate: 0.25 }),

        // Third conv block
        tf.layers.conv2d({
          filters: 128,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.batchNormalization(),
        tf.layers.maxPooling2d({ poolSize: 2 }),
        tf.layers.dropout({ rate: 0.25 }),

        // Fourth conv block
        tf.layers.conv2d({
          filters: 256,
          kernelSize: 3,
          activation: 'relu',
          padding: 'same'
        }),
        tf.layers.batchNormalization(),
        tf.layers.globalAveragePooling2d({}),

        // Classification layers
        tf.layers.dense({ units: 512, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 256, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.5 }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
      ]
    });

    return model;
  }

  private createAudioModel(): tf.LayersModel {
    // Model for audio feature analysis
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [128],
          units: 256,
          activation: 'relu'
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 4, activation: 'softmax' })
      ]
    });

    return model;
  }

  async saveModel(model: tf.LayersModel, type: string): Promise<string> {
    try {
      const saveUrl = `localstorage://trained-${type}-model`;
      await model.save(saveUrl);
      console.log(`Model saved to ${saveUrl}`);
      return saveUrl;
    } catch (error) {
      console.error('Failed to save model:', error);
      throw error;
    }
  }

  async loadTrainedModel(type: string): Promise<tf.LayersModel | null> {
    try {
      const loadUrl = `localstorage://trained-${type}-model`;
      const model = await tf.loadLayersModel(loadUrl);
      console.log(`Loaded trained model for ${type}`);
      return model;
    } catch (error) {
      console.error(`Failed to load trained model for ${type}:`, error);
      return null;
    }
  }

  isCurrentlyTraining(): boolean {
    return this.isTraining;
  }

  async evaluateModel(
    model: tf.LayersModel,
    type: 'spiral' | 'voice' | 'posture'
  ): Promise<{
    accuracy: number;
    loss: number;
    confusion: number[][];
  } | null> {
    try {
      const trainingData = await datasetManager.prepareTrainingData(type);
      if (!trainingData) return null;

      // Evaluate on test set
      const evaluation = model.evaluate(trainingData.testX, trainingData.testY);
      const evalResults = Array.isArray(evaluation) ? evaluation : [evaluation];
      const loss = await (evalResults[0] as tf.Scalar).data();
      const accuracy = await (evalResults[1] as tf.Scalar).data();

      // Generate confusion matrix
      const predictions = model.predict(trainingData.testX) as tf.Tensor;
      const predArray = await predictions.data();
      const trueArray = await trainingData.testY.data();

      const confusion = this.calculateConfusionMatrix(
        Array.from(trueArray),
        Array.from(predArray),
        4 // number of classes
      );

      // Clean up
      trainingData.testX.dispose();
      trainingData.testY.dispose();
      predictions.dispose();

      return {
        accuracy: accuracy[0],
        loss: loss[0],
        confusion
      };
    } catch (error) {
      console.error('Failed to evaluate model:', error);
      return null;
    }
  }

  private calculateConfusionMatrix(trueLabels: number[], predictions: number[], numClasses: number): number[][] {
    const matrix: number[][] = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
    
    for (let i = 0; i < trueLabels.length; i += numClasses) {
      // Find true class (one-hot encoded)
      let trueClass = 0;
      for (let j = 0; j < numClasses; j++) {
        if (trueLabels[i + j] === 1) {
          trueClass = j;
          break;
        }
      }
      
      // Find predicted class
      let predClass = 0;
      let maxProb = predictions[i];
      for (let j = 1; j < numClasses; j++) {
        if (predictions[i + j] > maxProb) {
          maxProb = predictions[i + j];
          predClass = j;
        }
      }
      
      matrix[trueClass][predClass]++;
    }
    
    return matrix;
  }
}

export const modelTrainer = new ModelTrainer();