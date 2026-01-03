/**
 * NextStepsModal - Display AI-generated next steps for a lead
 * Shows actionable recommendations based on user's business goal
 */

import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Checkbox, Chip, Dialog, DialogContent, DialogTitle, IconButton, LinearProgress, Typography } from '@mui/material';
import { useState } from 'react';

interface NextStep {
  step_id: string;
  action: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  platform?: string;
  completed: boolean;
  completed_at?: string;
}

interface NextStepsData {
  steps: NextStep[];
  generated_at: string;
  based_on_goal: string;
  summary: string;
}

interface NextStepsModalProps {
  open: boolean;
  onClose: () => void;
  leadName: string;
  nextSteps: NextStepsData | null;
  onMarkComplete: (stepId: string, completed: boolean) => Promise<void>;
  isUpdating?: boolean;
}

const NextStepsModal = ({ open, onClose, leadName, nextSteps, onMarkComplete, isUpdating = false }: NextStepsModalProps) => {
  const [loadingSteps, setLoadingSteps] = useState<Set<string>>(new Set());

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return { bg: '#FEE2E2', text: '#991B1B', label: 'HIGH PRIORITY' };
      case 'medium':
        return { bg: '#FEF3C7', text: '#92400E', label: 'MEDIUM PRIORITY' };
      case 'low':
        return { bg: '#DBEAFE', text: '#1E40AF', label: 'LOW PRIORITY' };
      default:
        return { bg: '#F3F4F6', text: '#374151', label: 'PRIORITY' };
    }
  };

  const getPlatformIcon = (platform?: string) => {
    if (!platform) return <PublicIcon sx={{ fontSize: 16 }} />;

    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <LinkedInIcon sx={{ fontSize: 16 }} />;
      case 'twitter':
      case 'x':
        return <TwitterIcon sx={{ fontSize: 16 }} />;
      case 'email':
        return <EmailIcon sx={{ fontSize: 16 }} />;
      case 'phone':
        return <PhoneIcon sx={{ fontSize: 16 }} />;
      default:
        return <PublicIcon sx={{ fontSize: 16 }} />;
    }
  };

  const handleToggleComplete = async (stepId: string, currentStatus: boolean) => {
    setLoadingSteps((prev) => new Set(prev).add(stepId));
    try {
      await onMarkComplete(stepId, !currentStatus);
    } finally {
      setLoadingSteps((prev) => {
        const newSet = new Set(prev);
        newSet.delete(stepId);
        return newSet;
      });
    }
  };

  if (!nextSteps) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Next Steps</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography color="textSecondary">No next steps available for this lead.</Typography>
        </DialogContent>
      </Dialog>
    );
  }

  const pendingSteps = nextSteps.steps.filter((s) => !s.completed);
  const completedSteps = nextSteps.steps.filter((s) => s.completed);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              🎯 Next Steps for {leadName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {nextSteps.summary}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Goal Context */}
        <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '8px', p: 2, mb: 3 }}>
          <Typography variant="caption" fontWeight={600} color="#6B7280" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Your Goal
          </Typography>
          <Typography variant="body2" color="#374151" mt={0.5}>
            {nextSteps.based_on_goal}
          </Typography>
        </Box>

        {/* Pending Steps */}
        {pendingSteps.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={2}>
              Recommended Actions ({pendingSteps.length})
            </Typography>

            {pendingSteps.map((step, index) => {
              const priorityStyle = getPriorityColor(step.priority);
              const isLoading = loadingSteps.has(step.step_id);

              return (
                <Box
                  key={step.step_id}
                  sx={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    p: 2.5,
                    mb: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      borderColor: '#D1D5DB',
                    },
                  }}
                >
                  {/* Priority Badge */}
                  <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                    <Chip
                      label={priorityStyle.label}
                      size="small"
                      sx={{
                        backgroundColor: priorityStyle.bg,
                        color: priorityStyle.text,
                        fontWeight: 700,
                        fontSize: '10px',
                        height: 22,
                        letterSpacing: '0.5px',
                      }}
                    />
                    {step.platform && (
                      <Chip
                        icon={getPlatformIcon(step.platform)}
                        label={step.platform.charAt(0).toUpperCase() + step.platform.slice(1)}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '11px',
                          height: 22,
                          borderColor: '#D1D5DB',
                          color: '#6B7280',
                        }}
                      />
                    )}
                    <Box flex={1} />
                    <Typography variant="caption" color="#9CA3AF">
                      {Math.round(step.confidence * 100)}% confidence
                    </Typography>
                  </Box>

                  {/* Action */}
                  <Box display="flex" alignItems="flex-start" gap={1.5}>
                    <Checkbox checked={step.completed} onChange={() => handleToggleComplete(step.step_id, step.completed)} disabled={isLoading} sx={{ mt: -0.5 }} />
                    <Box flex={1}>
                      <Typography variant="body1" fontWeight={600} color="#1F2937" mb={1}>
                        {step.action}
                      </Typography>
                      <Typography variant="body2" color="#6B7280" fontSize="13px">
                        💡 {step.reasoning}
                      </Typography>
                    </Box>
                  </Box>

                  {isLoading && <LinearProgress sx={{ mt: 1 }} />}
                </Box>
              );
            })}
          </Box>
        )}

        {/* Completed Steps */}
        {completedSteps.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={2}>
              ✅ Completed ({completedSteps.length})
            </Typography>

            {completedSteps.map((step) => {
              const isLoading = loadingSteps.has(step.step_id);

              return (
                <Box
                  key={step.step_id}
                  sx={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    p: 2,
                    mb: 1.5,
                    opacity: 0.8,
                  }}
                >
                  <Box display="flex" alignItems="flex-start" gap={1.5}>
                    <Checkbox checked={step.completed} onChange={() => handleToggleComplete(step.step_id, step.completed)} disabled={isLoading} sx={{ mt: -0.5 }} />
                    <Box flex={1}>
                      <Typography variant="body2" color="#6B7280" sx={{ textDecoration: 'line-through' }}>
                        {step.action}
                      </Typography>
                      {step.completed_at && (
                        <Typography variant="caption" color="#9CA3AF" mt={0.5} display="block">
                          Completed {new Date(step.completed_at).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {isLoading && <LinearProgress sx={{ mt: 1 }} />}
                </Box>
              );
            })}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ borderTop: '1px solid #E5E7EB', pt: 2, mt: 3 }}>
          <Typography variant="caption" color="#9CA3AF">
            Generated {new Date(nextSteps.generated_at).toLocaleString()} • AI-powered recommendations
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NextStepsModal;
