import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  Grid,
  Fab,
  Tooltip,
  MenuItem,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Send as SendIcon, 
  Mic as MicIcon, 
  Stop as StopIcon,
  GraphicEq,
  ExpandMore,
  CheckCircle,
  Cancel,
  PlayArrow,
  AssignmentTurnedIn
} from '@mui/icons-material';
import GlassCard from '../../components/common/GlassCard';
import ChatBubble from '../../components/common/ChatBubble';
import ScoreGauge from '../../components/common/ScoreGauge';
import { 
  startInterview, 
  getNextQuestion, 
  submitAnswer, 
  completeInterview 
} from '../../api/interviewApi';
import { toast } from 'react-hot-toast';

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

const parseBullets = (text) => {
  if (!text) return [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines.map(line => line.replace(/^[-*•\d.]+\s+/, ''));
  }
  return text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
};

const MockInterviewPage = () => {
  // Step states: 'setup', 'interview', 'report'
  const [step, setStep] = useState('setup');
  const [domain, setDomain] = useState('REACT');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [starting, setStarting] = useState(false);

  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [report, setReport] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (step === 'interview') {
      scrollToBottom();
    }
  }, [messages, isTyping, step]);

  useEffect(() => {
    // Setup Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setInput(prev => prev + finalTranscript + ' ');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsListening(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech Recognition is not supported in this browser.");
      }
    }
  };

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const startRes = await startInterview(domain, difficulty);
      if (startRes.success && startRes.data) {
        const intId = startRes.data.id;
        setInterviewId(intId);
        setStep('interview');
        setMessages([
          { 
            id: 'welcome', 
            sender: 'ai', 
            text: `Hello! I'm your AI interviewer. Today we'll be focusing on ${domain.replace('_', ' ')} (${difficulty.toLowerCase()} level). Let's begin.`, 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
          }
        ]);
        
        // Fetch first question
        setIsTyping(true);
        const qRes = await getNextQuestion(intId);
        setIsTyping(false);
        
        if (qRes.success && qRes.data) {
          setCurrentQuestion(qRes.data);
          setMessages(prev => [...prev, {
            id: qRes.data.id,
            sender: 'ai',
            text: `Question ${qRes.data.questionOrder}: ${qRes.data.question}`,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }]);
        } else {
          toast.error("Failed to load interview questions.");
        }
      } else {
        toast.error(startRes.message || "Failed to start interview.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to start interview.");
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !currentQuestion || submittingAnswer) return;

    const answerText = input.trim();
    setInput('');
    setSubmittingAnswer(true);

    // Add user answer to chat
    const userMsgId = Date.now();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: answerText,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]);

    setIsTyping(true);

    try {
      // Submit answer to backend
      const ansRes = await submitAnswer(interviewId, currentQuestion.id, answerText);
      setIsTyping(false);

      if (ansRes.success && ansRes.data) {
        const evalData = ansRes.data;
        // Append feedback in chat
        setMessages(prev => [...prev, {
          id: `eval-${evalData.id}`,
          sender: 'ai',
          text: `Evaluation score: ${evalData.score}/10.\nFeedback: ${evalData.feedback}`,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }]);

        // Fetch next question
        setIsTyping(true);
        const nextQRes = await getNextQuestion(interviewId);
        setIsTyping(false);

        if (nextQRes.success && nextQRes.data) {
          setCurrentQuestion(nextQRes.data);
          setMessages(prev => [...prev, {
            id: nextQRes.data.id,
            sender: 'ai',
            text: `Question ${nextQRes.data.questionOrder}: ${nextQRes.data.question}`,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }]);
        } else {
          // No more questions
          setCurrentQuestion(null);
          setMessages(prev => [...prev, {
            id: 'finish-message',
            sender: 'ai',
            text: "You have completed all questions! Please click 'Complete Interview' to generate your final performance report.",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }]);
        }
      } else {
        toast.error("Failed to evaluate answer.");
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      toast.error(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleCompleteInterview = async () => {
    setCompleting(true);
    try {
      const res = await completeInterview(interviewId);
      if (res.success && res.data) {
        setReport(res.data);
        setStep('report');
        toast.success("Interview completed successfully!");
      } else {
        toast.error(res.message || "Failed to complete interview.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to complete interview.");
    } finally {
      setCompleting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setStep('setup');
    setInterviewId(null);
    setCurrentQuestion(null);
    setMessages([]);
    setReport(null);
  };

  if (step === 'setup') {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <GlassCard>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="800" gutterBottom>
              AI Mock Interview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Conduct a simulated technical interview with our AI agent. Get evaluated in real-time.
            </Typography>
          </Box>

          <TextField
            select
            fullWidth
            label="Domain / Topic"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
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
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            sx={{ mb: 4 }}
          >
            {difficulties.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleStartInterview}
            disabled={starting}
            startIcon={starting ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
            sx={{ py: 1.8, borderRadius: 3, fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            {starting ? 'Initializing Session...' : 'Start Interview'}
          </Button>
        </GlassCard>
      </Box>
    );
  }

  if (step === 'interview') {
    return (
      <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="800">Mock Interview</Typography>
            <Typography variant="caption" color="text.secondary">
              Domain: {domain.replace('_', ' ')} | Difficulty: {difficulty.toLowerCase()}
            </Typography>
          </Box>
          {!currentQuestion && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCompleteInterview}
              disabled={completing}
              startIcon={completing ? <CircularProgress size={16} color="inherit" /> : <AssignmentTurnedIn />}
            >
              {completing ? 'Completing...' : 'Complete & View Report'}
            </Button>
          )}
        </Box>

        <GlassCard 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            p: 0, 
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column' }}>
            {messages.map(msg => (
              <ChatBubble key={msg.id} message={msg.text} sender={msg.sender} timestamp={msg.time} />
            ))}
            {isTyping && (
               <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, gap: 1, mt: 1 }}>
                 <GraphicEq sx={{ color: 'primary.main', fontSize: 16 }} />
                 <Typography variant="caption" color="text.secondary">AI is thinking...</Typography>
               </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box 
            sx={{ 
              p: 2, 
              borderTop: '1px solid rgba(255,255,255,0.1)', 
              bgcolor: 'rgba(18,18,18,0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Tooltip title={isListening ? "Stop Listening" : "Start Voice Input"}>
                  <Fab 
                    color={isListening ? "secondary" : "primary"} 
                    size="medium" 
                    onClick={toggleListening}
                    disabled={!currentQuestion}
                    sx={{ 
                      animation: isListening ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 0 0 rgba(245, 0, 87, 0.7)' },
                        '70%': { boxShadow: '0 0 0 10px rgba(245, 0, 87, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(245, 0, 87, 0)' },
                      }
                    }}
                  >
                    {isListening ? <StopIcon /> : <MicIcon />}
                  </Fab>
                </Tooltip>
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  disabled={!currentQuestion}
                  placeholder={!currentQuestion ? "Interview completed. View report above." : isListening ? "Listening..." : "Type your answer here..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.03)'
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <IconButton 
                  color="primary" 
                  onClick={handleSend}
                  disabled={(!input.trim() && !isListening) || !currentQuestion || submittingAnswer}
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: '#fff', 
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: 48,
                    height: 48
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </GlassCard>
      </Box>
    );
  }

  if (step === 'report' && report) {
    return (
      <Box sx={{ pb: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="800">Interview Evaluation</Typography>
            <Typography variant="body1" color="text.secondary">
              Review your performance summary and question breakdowns.
            </Typography>
          </Box>
          <Button variant="outlined" color="primary" onClick={handleReset}>
            Start New Interview
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <GlassCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
              <ScoreGauge score={report.overallScore} maxScore={100} label="Overall Score" size={160} />
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <GlassCard sx={{ height: '100%' }}>
              <Typography variant="h6" fontWeight="700" gutterBottom>Detailed Assessment</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {report.detailedReport}
              </Typography>
              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="600" color="success.main" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ mr: 1, fontSize: 18 }} /> Key Strengths
                  </Typography>
                  <List dense>
                    {parseBullets(report.strengths).map((s, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.25 }}>
                        <ListItemText primary={s} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="600" color="error.main" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Cancel sx={{ mr: 1, fontSize: 18 }} /> Weaknesses & Recommendations
                  </Typography>
                  <List dense>
                    {parseBullets(report.weaknesses).map((w, i) => (
                      <ListItem key={i} sx={{ px: 0, py: 0.25 }}>
                        <ListItemText primary={w} primaryTypographyProps={{ variant: 'body2' }} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </GlassCard>
          </Grid>
        </Grid>

        <Typography variant="h5" fontWeight="800" sx={{ mb: 2 }}>Question Breakdown</Typography>
        {report.questions && report.questions.map((q, idx) => (
          <Accordion 
            key={q.id || idx} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.02)', 
              mb: 2, 
              borderRadius: '12px !important',
              border: '1px solid rgba(255,255,255,0.05)',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                <Typography variant="body1" fontWeight="600">
                  Question {q.questionOrder || idx + 1}: {q.question}
                </Typography>
                <Chip 
                  label={`Score: ${q.score != null ? q.score : 0}/10`} 
                  color={q.score >= 7 ? 'success' : q.score >= 4 ? 'warning' : 'error'} 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="primary.main" display="block">Your Answer:</Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', pl: 1, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                    {q.userAnswer || 'No answer provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="success.main" display="block">Expected Answer Guidelines:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {q.expectedAnswer}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="secondary.main" display="block">AI Evaluation Feedback:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {q.feedback}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  }

  return null;
};

export default MockInterviewPage;
