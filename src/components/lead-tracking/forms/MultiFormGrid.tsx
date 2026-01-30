/**
 * MultiFormGrid - Grid of lead form cards supporting multiple forms per lead type
 * PRD Feature 2: Multiple Lead Forms - Section 4.1-4.5
 *
 * NEW COMPONENT - Replaces LeadTypeCard when multiple forms exist
 */

import { DateHelper } from '@/helpers/DateHelper';
import { LeadFormDto } from '@/models/dtos/LeadFormDto';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Button, Chip, Grid, IconButton, Menu, MenuItem, Switch, Typography } from '@mui/material';
import router from 'next/router';
import { useState } from 'react';

interface MultiFormGridProps {
  forms: LeadFormDto[];
  leadType: string;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
  onSetDefault: (formId: string) => void;
  onTogglePause: (formId: string, isPaused: boolean) => void;
  onToggleAutoGen: (formId: string, isEnabled: boolean) => void;
  onCreate: () => void;
}

const MultiFormGrid = ({ forms, leadType, onEdit, onDelete, onSetDefault, onTogglePause, onToggleAutoGen, onCreate }: MultiFormGridProps) => {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, formId: string) => {
    event.stopPropagation();
    setAnchorEl({ ...anchorEl, [formId]: event.currentTarget });
  };

  const handleMenuClose = (formId: string) => {
    setAnchorEl({ ...anchorEl, [formId]: null });
  };

  const handleMenuAction = (formId: string, action: () => void) => {
    action();
    handleMenuClose(formId);
  };

  const getFormTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      individual: '#3B82F6',
      organization: '#10B981',
      business: '#F59E0B',
      conversational: '#8B5CF6',
    };
    return colors[type.toLowerCase()] || '#6C727F';
  };

  const handleCardClick = (form: LeadFormDto) => {
    router.push(`/leads-tracking?type=${leadType}&form_id=${form.lead_form_id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography fontSize="18px" fontWeight={700} color="#374151">
            {leadType} Forms
          </Typography>
          <Typography fontSize="13px" color="#6C727F" mt={0.5}>
            {forms.length} {forms.length === 1 ? 'form' : 'forms'} configured
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{
            backgroundColor: '#C91A79',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#A0155E',
            },
          }}
        >
          Create New Form
        </Button>
      </Box>

      {/* Forms Grid */}
      <Grid container spacing={2}>
        {forms.map((form) => {
          const isDefault = form.disabled === false;
          const isPaused = form.disabled === true;
          const autoGenEnabled = form.auto_generate || false;
          const borderColor = getFormTypeColor(leadType);

          return (
            <Grid item xs={12} md={6} lg={4} key={form.lead_form_id}>
              <Box
                onClick={() => handleCardClick(form)}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: `3px solid ${borderColor}`,
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Header with menu */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography fontSize="16px" fontWeight={700} color="#374151" noWrap sx={{ maxWidth: 220 }}>
                        {form.form_title || 'Untitled Form'}
                      </Typography>
                      {isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            backgroundColor: '#DCFCE7',
                            color: '#166534',
                            fontWeight: 600,
                            fontSize: '11px',
                            height: 20,
                          }}
                        />
                      )}
                    </Box>
                    <Typography fontSize="12px" color="#6C727F">
                      {form.form_type || leadType}
                    </Typography>
                  </Box>

                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, form.lead_form_id)} sx={{ color: '#6C727F' }}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>

                  <Menu anchorEl={anchorEl[form.lead_form_id]} open={Boolean(anchorEl[form.lead_form_id])} onClose={() => handleMenuClose(form.lead_form_id)} onClick={(e) => e.stopPropagation()}>
                    <MenuItem onClick={() => handleMenuAction(form.lead_form_id, () => onEdit(form.lead_form_id))}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Edit Form
                    </MenuItem>
                    {!isDefault && (
                      <MenuItem onClick={() => handleMenuAction(form.lead_form_id, () => onSetDefault(form.lead_form_id))}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                        Set as Default
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => handleMenuAction(form.lead_form_id, () => onTogglePause(form.lead_form_id, !isPaused))}>
                      {isPaused ? <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} /> : <PauseIcon fontSize="small" sx={{ mr: 1 }} />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </MenuItem>
                    {!isDefault && (
                      <MenuItem onClick={() => handleMenuAction(form.lead_form_id, () => onDelete(form.lead_form_id))} sx={{ color: '#FF5252' }}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete Form
                      </MenuItem>
                    )}
                  </Menu>
                </Box>

                {/* Status badges */}
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  {isPaused && (
                    <Chip
                      label="Paused"
                      size="small"
                      sx={{
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        fontWeight: 600,
                        fontSize: '11px',
                      }}
                    />
                  )}
                  {autoGenEnabled && (
                    <Chip
                      label="Auto-Gen"
                      size="small"
                      sx={{
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF',
                        fontWeight: 600,
                        fontSize: '11px',
                      }}
                    />
                  )}
                </Box>

                {/* Stats */}
                <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: '8px', p: 1.5, mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography fontSize="11px" color="#6C727F">
                        Total Leads
                      </Typography>
                      <Typography fontSize="16px" fontWeight={700} color="#374151">
                        {form.total_leads || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography fontSize="11px" color="#6C727F">
                        New Leads
                      </Typography>
                      <Typography fontSize="16px" fontWeight={700} color="#374151">
                        {form.total_new_leads || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Keywords preview */}
                {form.q_keywords && (
                  <Box mb={2}>
                    <Typography fontSize="11px" color="#6C727F" mb={0.5}>
                      Keywords
                    </Typography>
                    <Typography fontSize="12px" color="#374151" noWrap>
                      {form.q_keywords || 'N/A'}
                    </Typography>
                  </Box>
                )}

                {/* Footer */}
                <Box display="flex" justifyContent="space-between" alignItems="center" pt={1.5} borderTop="1px solid #E5E7EB">
                  <Typography fontSize="11px" color="#9CA3AF">
                    Updated {form.last_updated ? DateHelper.formatDate(form.last_updated) : 'N/A'}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography fontSize="11px" color="#6C727F">
                      Auto-Gen
                    </Typography>
                    <Switch
                      size="small"
                      checked={autoGenEnabled}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onToggleAutoGen(form.lead_form_id, e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#10B981',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#10B981',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty state */}
      {forms.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            px: 3,
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '2px dashed #E5E7EB',
          }}
        >
          <Typography fontSize="18px" fontWeight={600} color="#374151" mb={1}>
            No Forms Created Yet
          </Typography>
          <Typography fontSize="14px" color="#6C727F" textAlign="center" mb={3}>
            Create your first lead form to start tracking {leadType.toLowerCase()} leads.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{
              backgroundColor: '#C91A79',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#A0155E',
              },
            }}
          >
            Create Form
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MultiFormGrid;
