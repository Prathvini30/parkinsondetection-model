import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Database, 
  Play, 
  Square, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Mic,
  User
} from 'lucide-react';
import { datasetManager } from '@/services/datasets/DatasetManager';
import { modelTrainer, TrainingProgress, TrainingConfig } from '@/services/training/ModelTrainer';
import { toast } from 'sonner';

const TrainingDashboard: React.FC = () => {
  const [datasetsLoaded, setDatasetsLoaded] = useState(false);
  const [datasetStats, setDatasetStats] = useState<Record<string, any>>({});
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState('datasets');
  const [trainedModels, setTrainedModels] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const loaded = await datasetManager.loadAllDatasets();
      if (loaded) {
        setDatasetsLoaded(true);
        
        // Get stats for all dataset types
        const stats: Record<string, any> = {};
        ['spiral', 'voice', 'posture'].forEach(type => {
          stats[type] = datasetManager.getDatasetStats(type as any);
        });
        setDatasetStats(stats);
        
        toast.success('Datasets loaded successfully!');
      } else {
        toast.error('Failed to load some datasets');
      }
    } catch (error) {
      toast.error('Error loading datasets');
      console.error(error);
    }
  };

  const startTraining = async (type: 'spiral' | 'voice' | 'posture') => {
    if (isTraining) {
      toast.error('Training already in progress');
      return;
    }

    setIsTraining(true);
    setTrainingProgress(null);

    const config: TrainingConfig = {
      epochs: 20,
      batchSize: 32,
      learningRate: 0.001,
      validationSplit: 0.2
    };

    try {
      toast.info(`Starting ${type} model training...`);
      
      const model = await modelTrainer.trainModel(
        type,
        config,
        (progress) => {
          setTrainingProgress(progress);
        }
      );

      if (model) {
        await modelTrainer.saveModel(model, type);
        setTrainedModels(prev => ({ ...prev, [type]: true }));
        toast.success(`${type} model trained successfully!`);
      } else {
        toast.error(`Failed to train ${type} model`);
      }
    } catch (error) {
      toast.error(`Training failed: ${error}`);
      console.error(error);
    } finally {
      setIsTraining(false);
      setTrainingProgress(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'spiral': return <Eye className="h-4 w-4" />;
      case 'voice': return <Mic className="h-4 w-4" />;
      case 'posture': return <User className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'spiral': return 'Spiral Drawing';
      case 'voice': return 'Voice Analysis';
      case 'posture': return 'Posture Analysis';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ML Training Dashboard</h1>
          <p className="text-muted-foreground">Train and evaluate Parkinson's detection models</p>
        </div>
        <Badge variant={datasetsLoaded ? "default" : "secondary"}>
          {datasetsLoaded ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Datasets Ready
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 mr-1" />
              Loading Datasets
            </>
          )}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="datasets" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datasets
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Evaluation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datasets" className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              Public sample datasets with synthetic but realistic patterns for each modality.
              Each dataset includes healthy, mild, moderate, and severe cases.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(datasetStats).map(([type, stats]) => (
              <Card key={type}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getIcon(type)}
                    {getTypeLabel(type)}
                  </CardTitle>
                  <CardDescription>
                    {stats ? `${stats.total} samples total` : 'Loading...'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Train:</span>
                        <span className="font-mono">{stats.train}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Test:</span>
                        <span className="font-mono">{stats.test}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Validation:</span>
                        <span className="font-mono">{stats.validation}</span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Class Distribution:</p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {Object.entries(stats.distribution).map(([label, count]) => (
                            <div key={label} className="flex justify-between">
                              <span className="capitalize">{label}:</span>
                              <span className="font-mono">{String(count)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          {trainingProgress && (
            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>
                  Epoch {trainingProgress.epoch} of {trainingProgress.totalEpochs}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress 
                  value={(trainingProgress.epoch / trainingProgress.totalEpochs) * 100}
                  className="w-full"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Loss: </span>
                    <span className="font-mono">{trainingProgress.loss.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy: </span>
                    <span className="font-mono">{(trainingProgress.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  {trainingProgress.valLoss && (
                    <div>
                      <span className="text-muted-foreground">Val Loss: </span>
                      <span className="font-mono">{trainingProgress.valLoss.toFixed(4)}</span>
                    </div>
                  )}
                  {trainingProgress.valAccuracy && (
                    <div>
                      <span className="text-muted-foreground">Val Accuracy: </span>
                      <span className="font-mono">{(trainingProgress.valAccuracy * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['spiral', 'voice', 'posture'].map((type) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getIcon(type)}
                    {getTypeLabel(type)}
                  </CardTitle>
                  <CardDescription>
                    Train a new model for {type} analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Architecture:</span>
                      <span className="text-muted-foreground">
                        {type === 'voice' ? 'Dense NN' : 'CNN'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Epochs:</span>
                      <span className="text-muted-foreground">20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Batch Size:</span>
                      <span className="text-muted-foreground">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={trainedModels[type] ? "default" : "outline"}>
                        {trainedModels[type] ? 'Trained' : 'Not Trained'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => startTraining(type as any)}
                    disabled={!datasetsLoaded || isTraining}
                    className="w-full"
                    variant={trainedModels[type] ? "secondary" : "default"}
                  >
                    {isTraining ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Training...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {trainedModels[type] ? 'Retrain' : 'Start Training'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-4">
          <Alert>
            <BarChart3 className="h-4 w-4" />
            <AlertDescription>
              Model evaluation metrics will appear here after training completion.
              This includes accuracy, loss, and confusion matrices.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(trainedModels).filter(([_, trained]) => trained).map(([type]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getIcon(type)}
                    {getTypeLabel(type)} Model
                  </CardTitle>
                  <CardDescription>Performance metrics on test set</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Evaluation metrics will be displayed after training</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {Object.keys(trainedModels).filter(type => trainedModels[type]).length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No trained models available for evaluation</p>
                  <p className="text-sm">Train some models first in the Training tab</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;