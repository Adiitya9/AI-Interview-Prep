import React from 'react';
import { Box, Typography, Grid, Step, Stepper, StepLabel, StepContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const progressData = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 1.5 },
];

const steps = [
  {
    label: 'Complete Resume Analysis',
    description: `Uploaded your resume and achieved an ATS score of 85%.`,
    completed: true,
  },
  {
    label: 'Initial Mock Interview',
    description: 'Completed your first AI mock interview for Frontend Developer role.',
    completed: true,
  },
  {
    label: 'Identify Skill Gaps',
    description: 'System Design and Algorithms identified as key areas for improvement.',
    completed: true,
  },
  {
    label: 'Practice Target Areas',
    description: 'Use the Question Generator to practice 50 System Design questions.',
    completed: false,
  },
  {
    label: 'Final Mock Interview',
    description: 'Achieve a score of 90%+ in a full simulated interview.',
    completed: false,
  },
];

const ProgressPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
          Your Progress Path
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your preparation journey and study hours.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
              Preparation Roadmap
            </Typography>
            <Stepper orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label} active={!step.completed && index === steps.findIndex(s => !s.completed)} completed={step.completed}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-label': { color: 'text.primary', fontWeight: step.completed ? 500 : 700 },
                      '& .MuiStepIcon-root.Mui-active': { color: 'primary.main' },
                      '& .MuiStepIcon-root.Mui-completed': { color: 'success.main' },
                    }}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>{step.description}</Typography>
                    {!step.completed && (
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => navigate(index === 3 ? '/questions' : '/interview')}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={5}>
          <GlassCard sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Study Hours (This Week)
            </Typography>
            <Box sx={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1e1e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="hours" fill="#03dac6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>

          <GlassCard sx={{ bgcolor: 'rgba(187, 134, 252, 0.1)', borderColor: 'rgba(187, 134, 252, 0.3)' }}>
            <Typography variant="h3" fontWeight="900" color="primary.main" gutterBottom>
              19.5h
            </Typography>
            <Typography variant="body1" fontWeight="600">
              Total preparation time this week.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You are in the top 15% of active users! Keep up the great work.
            </Typography>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProgressPage;
