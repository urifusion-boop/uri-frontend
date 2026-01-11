import { LeadsService as LeadFormService } from '@/api/LeadFormService';
import { triggerToast } from '@/components/atoms/CustomToast';
import { useAuth } from '@/providers/AuthProvider';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Link, Typography } from '@mui/material';
import { useState } from 'react';

interface DecisionMaker {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  organization_name?: string;
  id?: string;
}

interface DecisionMakerModalProps {
  open: boolean;
  onClose: () => void;
  decisionMakers: DecisionMaker[];
  jobTitle?: string;
  companyName?: string;
  parentJobSignalId?: string; // Link back to job signal lead
  errorMessage?: string | null; // Error message from API
  suggestion?: string | null; // Helpful suggestion for user
}

const DecisionMakerModal = ({ open, onClose, decisionMakers, jobTitle, companyName, parentJobSignalId, errorMessage, suggestion }: DecisionMakerModalProps) => {
  const { userDetails } = useAuth();
  const [adding, setAdding] = useState<string | null>(null); // Track which decision-maker is being added

  const handleAddToIndividualLeads = async (dm: DecisionMaker) => {
    if (!dm.name || !dm.email) {
      triggerToast('error', 'Decision-maker must have name and email');
      return;
    }

    if (!userDetails?.userId) {
      triggerToast('error', 'User ID not found');
      return;
    }

    if (!parentJobSignalId) {
      triggerToast('error', 'Parent job signal ID missing');
      return;
    }

    setAdding(dm.id || dm.email);
    try {
      const response = await LeadFormService.addDecisionMakerToIndividualLeads({
        name: dm.name,
        email: dm.email,
        phone: dm.phone,
        linkedin_url: dm.linkedin_url,
        job_title: dm.title || '',
        company: dm.organization_name || companyName || '',
        user_id: userDetails.userId,
        parent_job_signal_id: parentJobSignalId,
        notes: `Decision-maker for ${jobTitle || 'job posting'} at ${dm.organization_name || companyName}. Contact regarding hiring needs.`,
      });

      if (response.status) {
        triggerToast('success', `${dm.name} added to Individual Leads`);
      } else {
        triggerToast('error', response.responseMessage || 'Failed to add decision-maker');
      }
    } catch (error: any) {
      triggerToast('error', error.message || 'Error adding decision-maker');
    } finally {
      setAdding(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Decision-Makers Found
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {jobTitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            For job posting: <strong>{jobTitle}</strong>
            {companyName && ` at ${companyName}`}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {errorMessage ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="error" sx={{ mb: 2, fontWeight: 500 }}>
              {errorMessage}
            </Typography>
            {suggestion && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                💡 {suggestion}
              </Typography>
            )}
          </Box>
        ) : decisionMakers.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No decision-makers found for this job posting.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {decisionMakers.map((dm, index) => (
              <Box
                key={dm.id || index}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: '#fafafa',
                }}
              >
                <Box display="flex" gap={2} alignItems="flex-start">
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#CD1B78',
                      fontSize: '20px',
                      fontWeight: 600,
                    }}
                  >
                    {dm.name?.charAt(0) || '?'}
                  </Avatar>

                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600}>
                      {dm.name || 'Unknown'}
                    </Typography>

                    {dm.title && <Chip label={dm.title} size="small" sx={{ mt: 0.5, fontWeight: 500 }} />}

                    {dm.organization_name && (
                      <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                        <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {dm.organization_name}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 1.5 }} />

                    <Box display="flex" flexDirection="column" gap={1}>
                      {dm.email && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <EmailIcon sx={{ fontSize: 18, color: '#CD1B78' }} />
                          <Link href={`mailto:${dm.email}`} underline="hover" sx={{ fontSize: '14px', color: 'text.primary' }}>
                            {dm.email}
                          </Link>
                        </Box>
                      )}

                      {dm.phone && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon sx={{ fontSize: 18, color: '#CD1B78' }} />
                          <Link href={`tel:${dm.phone}`} underline="hover" sx={{ fontSize: '14px', color: 'text.primary' }}>
                            {dm.phone}
                          </Link>
                        </Box>
                      )}

                      {dm.linkedin_url && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinkedInIcon sx={{ fontSize: 18, color: '#0077B5' }} />
                          <Link href={dm.linkedin_url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ fontSize: '14px', color: 'text.primary' }}>
                            View LinkedIn Profile
                          </Link>
                        </Box>
                      )}
                    </Box>

                    {/* Add to Individual Leads Button - PRD Section 8.4 */}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={adding === (dm.id || dm.email) ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
                        onClick={() => handleAddToIndividualLeads(dm)}
                        disabled={adding === (dm.id || dm.email)}
                        sx={{
                          backgroundColor: '#CD1B78',
                          '&:hover': { backgroundColor: '#b31665' },
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {adding === (dm.id || dm.email) ? 'Adding...' : 'Add to Individual Leads'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DecisionMakerModal;
