import { LazarusAlert } from '@/types/lazarus.types';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Chip, CircularProgress, Dialog, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface EmailComposerModalProps {
  open: boolean;
  onClose: () => void;
  alert: LazarusAlert | null;
  contactEmail?: string;
  onSent?: () => void;
}

const EmailComposerModal = ({ open, onClose, alert, contactEmail, onSent }: EmailComposerModalProps) => {
  const [to, setTo] = useState(contactEmail || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Generate initial email when modal opens
  useState(() => {
    if (alert && open) {
      generateEmail();
    }
  });

  const generateEmail = async () => {
    if (!alert) return;

    setRegenerating(true);
    try {
      // Use the suggested pitch as a base
      const signalType = alert.evidence?.signal_type || alert.alert_type;
      const evidence = alert.evidence?.evidence_text || '';

      // Generate subject based on signal type
      let generatedSubject = '';
      switch (signalType?.toLowerCase()) {
        case 'switch':
          generatedSubject = `Quick question about your recent switch`;
          break;
        case 'pain':
          generatedSubject = `I saw your post - we might be able to help`;
          break;
        case 'hiring':
          generatedSubject = `Scaling your team? Let's talk`;
          break;
        case 'funding':
          generatedSubject = `Congratulations on your funding round!`;
          break;
        default:
          generatedSubject = `Following up on your recent post`;
      }

      // Use suggested pitch if available, otherwise create a template
      const generatedBody =
        alert.suggested_pitch ||
        `Hi ${alert.source_name},

I noticed your recent post: "${evidence.substring(0, 100)}..."

${signalType === 'switch' ? "It sounds like you're exploring alternatives. " : ''}${signalType === 'pain' ? "I understand the challenges you're facing. " : ''}${signalType === 'hiring' ? "Looks like you're growing the team! " : ''}

I'd love to share how we've helped similar companies overcome these challenges. Would you be open to a quick 15-minute call this week?

Looking forward to hearing from you!

Best regards`;

      setSubject(generatedSubject);
      setBody(generatedBody);
      setTo(contactEmail || '');
    } catch (error) {
      console.error('Failed to generate email:', error);
      toast.error('Failed to generate email');
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    const fullEmail = `To: ${to}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success('Email copied to clipboard!');
  };

  const handleSend = () => {
    // Open mailto link
    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');

    toast.success('Email client opened!');

    // Call onSent callback
    if (onSent) {
      onSent();
    }

    // Close modal
    onClose();
  };

  if (!alert) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #7C3AED15 0%, #5B21B615 100%)',
          borderBottom: '2px solid #7C3AED30',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <SendIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography fontSize="20px" fontWeight={700} color="#1a1a1a">
              ✉️ Send Email to {alert.source_name}
            </Typography>
            <Typography fontSize="13px" color="#666">
              AI-generated pitch based on {alert.evidence?.signal_type || 'signal'} detected
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Email Form */}
      <Box sx={{ p: 4 }}>
        {/* Signal Context */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            background: '#F9FAFB',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
          }}
        >
          <Box display="flex" gap={1} mb={1}>
            <Chip label={`Signal: ${alert.evidence?.signal_type || alert.alert_type}`} size="small" sx={{ background: '#7C3AED15', color: '#7C3AED', fontWeight: 600 }} />
            {alert.evidence?.confidence && (
              <Chip label={`${Math.round(alert.evidence.confidence * 100)}% confidence`} size="small" sx={{ background: '#10B98115', color: '#10B981', fontWeight: 600 }} />
            )}
          </Box>
          <Typography fontSize="12px" color="#666" fontStyle="italic">
            "{alert.evidence?.evidence_text?.substring(0, 150)}..."
          </Typography>
        </Box>

        {/* To Field */}
        <TextField
          fullWidth
          label="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={!isEditing}
          sx={{ mb: 2 }}
          InputProps={{
            sx: { borderRadius: '8px' },
          }}
        />

        {/* Subject Field */}
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={!isEditing}
          sx={{ mb: 2 }}
          InputProps={{
            sx: { borderRadius: '8px' },
          }}
        />

        {/* Email Body */}
        <TextField
          fullWidth
          label="Email Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!isEditing}
          multiline
          rows={12}
          sx={{ mb: 3 }}
          InputProps={{
            sx: {
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: 1.6,
            },
          }}
        />

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="space-between">
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={regenerating ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
              onClick={generateEmail}
              disabled={regenerating}
              sx={{
                borderColor: '#7C3AED40',
                color: '#7C3AED',
                '&:hover': {
                  borderColor: '#7C3AED',
                  background: '#7C3AED08',
                },
              }}
            >
              🤖 Regenerate AI Pitch
            </Button>

            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                borderColor: '#3B82F640',
                color: '#3B82F6',
                '&:hover': {
                  borderColor: '#3B82F6',
                  background: '#3B82F608',
                },
              }}
            >
              {isEditing ? '✓ Done Editing' : '✏️ Edit'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopyToClipboard}
              sx={{
                borderColor: '#10B98140',
                color: '#10B981',
                '&:hover': {
                  borderColor: '#10B981',
                  background: '#10B98108',
                },
              }}
            >
              Copy
            </Button>
          </Box>

          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSend}
            disabled={!to || !subject || !body}
            sx={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
              },
            }}
          >
            Send Email
          </Button>
        </Box>

        {/* Personalization Helper */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            background: '#FEF3C7',
            borderRadius: '8px',
            border: '1px solid #FCD34D',
          }}
        >
          <Typography fontSize="12px" fontWeight={600} color="#92400E" mb={0.5}>
            💡 Pro Tip: Personalization Tokens
          </Typography>
          <Typography fontSize="11px" color="#78350F">
            Use <code>{'{{name}}'}</code>, <code>{'{{company}}'}</code>, <code>{'{{signal}}'}</code> for dynamic content
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EmailComposerModal;
