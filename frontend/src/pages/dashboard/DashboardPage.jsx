import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  CircularProgress
} from '@mui/material';
import { 
  PlayArrow, 
  Description, 
  QuestionAnswer, 
  Assessment 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../../components/common/StatsCard';
import ScoreGauge from '../../components/common/ScoreGauge';
import GlassCard from '../../components/common/GlassCard';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { getDashboard } from '../../api/dashboardApi';
import { getLatestResume, getResumes } from '../../api/resumeApi';
import { getInterviews } from '../../api/interviewApi';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [resumesCount, setResumesCount] = useState(0);
  const [latestResume, setLatestResume] = useState(null);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashRes, resumesRes, latestRes, interviewsRes] = await Promise.allSettled([
          getDashboard(),
          getResumes(),
          getLatestResume(),
          getInterviews()
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value.success) {
          setDashboardData(dashRes.value.data);
        }

        if (resumesRes.status === 'fulfilled' && resumesRes.value.success) {
          setResumesCount(resumesRes.value.data.length);
        }

        if (latestRes.status === 'fulfilled' && latestRes.value.success) {
          setLatestResume(latestRes.value.data);
        }

        if (interviewsRes.status === 'fulfilled' && interviewsRes.value.success) {
          setInterviews(interviewsRes.value.data || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Calculate dynamic performance data for chart
  const completedInterviews = interviews
    .filter(i => i.status === 'COMPLETED' && i.maxScore > 0)
    .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

  const chartData = completedInterviews.map((inter, idx) => ({
    name: `Int ${idx + 1}`,
    score: Math.round((inter.totalScore * 100) / inter.maxScore)
  }));

  if (chartData.length === 0) {
    chartData.push({ name: 'Baseline', score: 0 });
  }

  // Calculate overall readiness score based on resume ATS score and avg interview score
  const latestAtsScore = latestResume?.atsScore || 0;
  const avgInterviewScore = dashboardData?.averageScore || 0;

  let readinessScore = 0;
  if (latestResume && dashboardData && dashboardData.totalInterviews > 0) {
    readinessScore = Math.round((latestAtsScore + avgInterviewScore) / 2);
  } else if (latestResume) {
    readinessScore = latestAtsScore;
  } else if (dashboardData && dashboardData.totalInterviews > 0) {
    readinessScore = Math.round(avgInterviewScore);
  }

  const getReadinessFeedback = () => {
    if (readinessScore >= 80) {
      return "Excellent readiness! You are well-prepared for technical interviews. Keep refining your weak spots.";
    } else if (readinessScore >= 60) {
      return "Good progress! Focus on brushing up your weak areas and practice more questions to boost your score.";
    } else if (readinessScore > 0) {
      return "Getting started. Analyze your resume and practice mock interviews to build confidence and skills.";
    } else {
      return "No analysis data yet. Upload your resume and start a mock interview to calculate your readiness score.";
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, background: 'linear-gradient(90deg, #bb86fc 0%, #03dac6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's a summary of your interview preparation progress.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          startIcon={<PlayArrow />}
          onClick={() => navigate('/interview')}
          sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
        >
          Start Mock Interview
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Total Interviews" 
            value={dashboardData?.totalInterviews ?? 0} 
            icon={Assessment} 
            color="#bb86fc" 
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Avg Interview Score" 
            value={dashboardData?.averageScore != null ? `${Math.round(dashboardData.averageScore)}%` : "N/A"} 
            icon={PlayArrow} 
            color="#03dac6" 
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Latest ATS Score" 
            value={latestResume?.atsScore != null ? `${latestResume.atsScore}%` : "N/A"} 
            icon={Description} 
            color="#ff4081" 
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Resumes Analyzed" 
            value={resumesCount} 
            icon={QuestionAnswer} 
            color="#ffd740" 
            delay={0.4}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <GlassCard sx={{ height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Performance Trend
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#bb86fc" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#bb86fc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e1e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#bb86fc" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </GlassCard>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 4, alignSelf: 'flex-start' }}>
              Overall Readiness
            </Typography>
            <ScoreGauge score={readinessScore} maxScore={100} label="Readiness Score" size={200} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
              {getReadinessFeedback()}
            </Typography>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
