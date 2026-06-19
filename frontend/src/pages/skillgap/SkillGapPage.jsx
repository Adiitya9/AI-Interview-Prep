import React from 'react';
import { Box, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import GlassCard from '../../components/common/GlassCard';
import { Lightbulb, Warning } from '@mui/icons-material';

const skillData = [
  { subject: 'React', A: 90, fullMark: 100 },
  { subject: 'JavaScript', A: 85, fullMark: 100 },
  { subject: 'System Design', A: 40, fullMark: 100 },
  { subject: 'Algorithms', A: 65, fullMark: 100 },
  { subject: 'Behavioral', A: 75, fullMark: 100 },
  { subject: 'CSS/UI', A: 80, fullMark: 100 },
];

const gaps = [
  { skill: 'System Design', current: 40, target: 80, priority: 'High' },
  { skill: 'Algorithms', current: 65, target: 85, priority: 'Medium' },
];

const SkillGapPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
          Skill Gap Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Identify areas for improvement based on your mock interviews and resume.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ height: '100%', minHeight: 400 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Skills Radar
            </Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'transparent' }} />
                  <Radar name="Skills" dataKey="A" stroke="#bb86fc" fill="#bb86fc" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <GlassCard sx={{ height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ color: 'error.main', mr: 1 }} /> Priority Areas
            </Typography>
            
            {gaps.map((gap, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" fontWeight="600">{gap.skill}</Typography>
                  <Chip 
                    label={`${gap.priority} Priority`} 
                    size="small" 
                    color={gap.priority === 'High' ? 'error' : 'warning'} 
                    variant="outlined" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">Current: {gap.current}%</Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={gap.current} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: gap.priority === 'High' ? 'error.main' : 'warning.main',
                          borderRadius: 4
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">Target: {gap.target}%</Typography>
                </Box>
                
                <Box sx={{ bgcolor: 'rgba(3, 218, 198, 0.05)', p: 2, borderRadius: 2, mt: 2, borderLeft: '4px solid #03dac6' }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Lightbulb sx={{ fontSize: 16, mr: 0.5, color: '#03dac6' }} /> Recommendation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {gap.skill === 'System Design' 
                      ? "Focus on high-level architecture. Review common patterns for scaling distributed systems." 
                      : "Practice medium/hard level questions on LeetCode focusing on dynamic programming and trees."}
                  </Typography>
                </Box>
              </Box>
            ))}
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillGapPage;
