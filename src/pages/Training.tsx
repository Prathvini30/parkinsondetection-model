import React from 'react';
import TrainingDashboard from '@/components/training/TrainingDashboard';
import { MainLayout } from '@/components/layout/MainLayout';

const Training: React.FC = () => {
  return (
    <MainLayout>
      <TrainingDashboard />
    </MainLayout>
  );
};

export default Training;