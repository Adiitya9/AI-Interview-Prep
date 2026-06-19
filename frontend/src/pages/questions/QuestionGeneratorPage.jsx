import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Box, 
  Typography, 
  Grid, 
  TextField, 
  MenuItem, 
  Button, 
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress,
  Slider
} from '@mui/material';
import { 
  ExpandMore, 
  AutoAwesome, 
  Work,
  ContentCopy
} from '@mui/icons-material';
import GlassCard from '../../components/common/GlassCard';
import { generateQuestions } from '../../api/questionApi';

const domains = [
  { value: 'JAVA', label: 'Java' },
  { value: 'SPRING_BOOT', label: 'Spring Boot' },
  { value: 'REACT', label: 'React' },
  { value: 'SQL', label: 'SQL' },
  { value: 'DSA', label: 'Data Structures & Algorithms' },
  { value: 'SYSTEM_DESIGN', label: 'System Design' }
];

const difficulties = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' }
];

const QuestionGeneratorPage = () => {
  const [formData, setFormData] = useState({
    domain: 'REACT',
    difficulty: 'MEDIUM',
    count: 5
  });
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e, newValue) => {
    setFormData({ ...formData, count: newValue });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await generateQuestions(formData.domain, formData.difficulty, formData.count);
      if (res.success && res.data) {
        setQuestions(res.data.map(q => ({
          id: q.id,
          text: q.question,
          type: q.domain,
          difficulty: q.difficulty,
          tips: q.expectedAnswer
        })));
        toast.success('Questions generated successfully!');
      } else {
        toast.error(res.message || 'Failed to generate questions.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate questions.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyAll = () => {
    if (questions.length === 0) return;
    const textToCopy = questions.map((q, idx) => `${idx + 1}. ${q.text}\nPro Tip: ${q.tips}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    toast.success('All questions copied to clipboard!');
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
          Question Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate targeted interview questions based on domain and difficulty.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <GlassCard>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <AutoAwesome sx={{ color: 'primary.main', mr: 1 }} /> Configuration
            </Typography>
            
            <TextField
              select
              fullWidth
              label="Target Domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >
              {domains.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Difficulty Level"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              sx={{ mb: 3 }}
            >
              {difficulties.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ mb: 4, px: 1 }}>
              <Typography gutterBottom variant="body2" color="text.secondary">
                Number of Questions: {formData.count}
              </Typography>
              <Slider
                value={formData.count}
                onChange={handleSliderChange}
                min={1}
                max={20}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 15, label: '15' },
                  { value: 20, label: '20' }
                ]}
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={generating || !formData.domain || !formData.difficulty}
              startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <Work />}
              sx={{ py: 1.5, borderRadius: 2 }}
            >
              {generating ? 'Generating...' : 'Generate Questions'}
            </Button>
          </GlassCard>
        </Grid>

        <Grid item xs={12} md={8}>
          {questions.length > 0 ? (
            <GlassCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="600">Generated Questions</Typography>
                <Button 
                  startIcon={<ContentCopy />} 
                  size="small" 
                  variant="outlined"
                  onClick={handleCopyAll}
                >
                  Copy All
                </Button>
              </Box>
              
              {questions.map((q, index) => (
                <Accordion 
                  key={q.id || index} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.02)', 
                    mb: 2, 
                    borderRadius: '8px !important',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={q.type} size="small" color="primary" variant="outlined" />
                        <Chip 
                          label={q.difficulty} 
                          size="small" 
                          color={q.difficulty === 'HARD' ? 'error' : q.difficulty === 'MEDIUM' ? 'warning' : 'success'} 
                          variant="outlined" 
                        />
                      </Box>
                      <Typography variant="body1" fontWeight="500">
                        {index + 1}. {q.text}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      Pro Tip for Answering:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {q.tips}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </GlassCard>
          ) : (
            <Box sx={{ height: '100%', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 4 }}>
              <AutoAwesome sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No Questions Generated Yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mt: 1 }}>
                Fill out the configuration on the left and click "Generate Questions" to get tailored interview questions.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionGeneratorPage;
