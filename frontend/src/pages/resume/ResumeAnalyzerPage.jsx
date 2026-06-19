import React, { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  CloudUpload, 
  CheckCircle, 
  Cancel, 
  Description,
  Insights
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import GlassCard from '../../components/common/GlassCard';
import ScoreGauge from '../../components/common/ScoreGauge';
import { motion } from 'framer-motion';
import { uploadResume, getLatestResume } from '../../api/resumeApi';
import { toast } from 'react-hot-toast';

const parseBullets = (text) => {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines.map(line => line.replace(/^[-*•\d.]+\s+/, ''));
  }
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
};

const ResumeAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await getLatestResume();
        if (res.success && res.data) {
          const data = res.data;
          setResults({
            score: data.atsScore,
            atsCompatibility: data.atsScore,
            keywordsFound: data.skills || [],
            missingKeywords: data.missingSkills || [],
            strengths: parseBullets(data.feedback),
            weaknesses: parseBullets(data.suggestions)
          });
        }
      } catch (err) {
        console.log("No previous resume analysis found.");
      }
    };
    fetchLatest();
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    try {
      const res = await uploadResume(file);
      if (res.success && res.data) {
        const data = res.data;
        setResults({
          score: data.atsScore,
          atsCompatibility: data.atsScore,
          keywordsFound: data.skills || [],
          missingKeywords: data.missingSkills || [],
          strengths: parseBullets(data.feedback),
          weaknesses: parseBullets(data.suggestions)
        });
        toast.success("Resume analyzed successfully!");
      } else {
        toast.error(res.message || "Failed to analyze resume.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
          Resume Analyzer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your resume to get AI-powered feedback on ATS compatibility and content.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={file && results ? 5 : 12}>
          <GlassCard sx={{ height: '100%' }}>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed rgba(187, 134, 252, 0.5)',
                borderRadius: 4,
                p: 5,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDragActive ? 'rgba(187, 134, 252, 0.1)' : 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(187, 134, 252, 0.05)',
                  borderColor: '#bb86fc'
                }
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {isDragActive ? "Drop the resume here..." : "Drag & drop your resume"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Supports PDF, DOCX, DOC (Max 5MB)
              </Typography>
              <Button variant="outlined" color="primary">
                Browse Files
              </Button>
            </Box>

            {file && (
              <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Description sx={{ color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="body1" fontWeight="600">{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  startIcon={analyzing ? <CircularProgress size={20} color="inherit" /> : <Insights />}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze Now'}
                </Button>
              </Box>
            )}
          </GlassCard>
        </Grid>

        {results && (
          <Grid item xs={12} lg={7}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <GlassCard>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ScoreGauge score={results.score} maxScore={100} label="Resume Score" size={140} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <ScoreGauge score={results.atsCompatibility} maxScore={100} label="ATS Match" size={140} />
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight="600" sx={{ mb: 2, mt: 2 }}>Keywords Analysis</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Found in resume:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {results.keywordsFound.length > 0 ? (
                      results.keywordsFound.map(kw => (
                        <Chip key={kw} label={kw} color="success" variant="outlined" size="small" />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">None detected</Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Suggested additions:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {results.missingKeywords.length > 0 ? (
                      results.missingKeywords.map(kw => (
                        <Chip key={kw} label={kw} color="warning" variant="outlined" size="small" />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">None suggested</Typography>
                    )}
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="600" color="success.main" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ mr: 1, fontSize: 20 }} /> Strengths
                    </Typography>
                    <List dense>
                      {results.strengths.length > 0 ? (
                        results.strengths.map((s, i) => (
                          <ListItem key={i} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ fontSize: 16, color: 'success.main' }} /></ListItemIcon>
                            <ListItemText primary={s} primaryTypographyProps={{ variant: 'body2' }} />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No strengths listed</Typography>
                      )}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="600" color="error.main" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <Cancel sx={{ mr: 1, fontSize: 20 }} /> Areas for Improvement
                    </Typography>
                    <List dense>
                      {results.weaknesses.length > 0 ? (
                        results.weaknesses.map((w, i) => (
                          <ListItem key={i} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}><Cancel sx={{ fontSize: 16, color: 'error.main' }} /></ListItemIcon>
                            <ListItemText primary={w} primaryTypographyProps={{ variant: 'body2' }} />
                          </ListItem>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No improvements listed</Typography>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </GlassCard>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ResumeAnalyzerPage;
