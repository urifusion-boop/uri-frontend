import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal';
import { LightThemeColors } from '@/configs/colors.config';
import { LeadHelper } from '@/helpers/LeadHelper';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Button, Card, CardContent, Chip, Container, Grid, IconButton, InputAdornment, Menu, MenuItem, Skeleton, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { FaBriefcase, FaBuilding, FaComments, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const ManageAllFormsView = () => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const userId = userDetails?.userId || '';
  const isMobile = useMediaQuery('(max-width:800px)');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FormTypeEnum | 'all'>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<{ id: string; title: string } | null>(null);

  const { useGetLeadFormsByUserId, deleteLeadForm, setDefaultForm, togglePause, toggleAutoGenerate } = useLeadFormHooks();
  const { data: allForms = [], isLoading } = useGetLeadFormsByUserId(userId);

  // Filter and search forms
  const filteredForms = useMemo(() => {
    let filtered = allForms;

    console.log('📊 [ManageAllForms] Raw forms from backend:', filtered.length);
    console.log(
      '📊 [ManageAllForms] All forms data:',
      filtered.map((f: any) => ({
        id: f.lead_form_id,
        title: f.form_title,
        type: f.form_type,
        updated: f.last_updated,
      }))
    );

    // Hide Google Maps forms (functionality merged into Organization forms via Location Intelligence)
    filtered = filtered.filter((form: any) => form.form_type !== FormTypeEnum.GOOGLE_MAPS);

    // Deduplicate by lead_form_id (keep the most recently updated one)
    const uniqueFormsMap = new Map();
    const duplicatesFound: any[] = [];

    filtered.forEach((form: any) => {
      const existingForm = uniqueFormsMap.get(form.lead_form_id);
      if (existingForm) {
        duplicatesFound.push({
          lead_form_id: form.lead_form_id,
          title: form.form_title,
          existing_updated: existingForm.last_updated,
          duplicate_updated: form.last_updated,
        });
        console.warn('⚠️ [ManageAllForms] DUPLICATE DETECTED:', {
          lead_form_id: form.lead_form_id,
          title: form.form_title,
          existing: existingForm.last_updated,
          duplicate: form.last_updated,
          keeping: new Date(form.last_updated || 0) > new Date(existingForm.last_updated || 0) ? 'new' : 'existing',
        });
      }

      if (!existingForm || new Date(form.last_updated || 0) > new Date(existingForm.last_updated || 0)) {
        uniqueFormsMap.set(form.lead_form_id, form);
      }
    });

    if (duplicatesFound.length > 0) {
      console.error('🚨 [ManageAllForms] Total duplicates found:', duplicatesFound.length);
      console.error('🚨 [ManageAllForms] Duplicate details:', duplicatesFound);
    }

    filtered = Array.from(uniqueFormsMap.values());
    console.log('✅ [ManageAllForms] After deduplication:', filtered.length);

    if (filterType !== 'all') {
      filtered = filtered.filter((form: any) => form.form_type === filterType);
    }

    if (searchQuery) {
      filtered = filtered.filter((form: any) => form.form_title?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered.sort((a: any, b: any) => {
      // Sort by: default first, then by updated date
      if (a.is_default !== b.is_default) return a.is_default ? -1 : 1;
      return new Date(b.last_updated || 0).getTime() - new Date(a.last_updated || 0).getTime();
    });
  }, [allForms, filterType, searchQuery]);

  // Group forms by type for stats
  const formStats = useMemo(() => {
    const stats = {
      total: allForms.length,
      totalLeads: 0,
      [FormTypeEnum.PERSON]: 0,
      [FormTypeEnum.ORGANIZATION]: 0,
      [FormTypeEnum.BUSINESS]: 0,
      [FormTypeEnum.CONVERSATIONAL]: 0,
      [FormTypeEnum.GOOGLE_MAPS]: 0,
    };

    allForms.forEach((form: any) => {
      if (form.form_type) {
        stats[form.form_type as FormTypeEnum]++;
      }
      stats.totalLeads += form.total_leads || 0;
    });

    return stats;
  }, [allForms]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, form: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedForm(form);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedForm(null);
  };

  const handleEditForm = (form: any) => {
    const typeUrl = LeadHelper.getLeadFormType(form.form_type);
    router.push(`/leads-tracking/forms/manage?type=${typeUrl}&form_id=${form.lead_form_id}`);
    handleMenuClose();
  };

  const handleDeleteForm = async (formId: string, formTitle: string) => {
    setFormToDelete({ id: formId, title: formTitle });
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (!formToDelete) return;

    deleteLeadForm.mutate(formToDelete.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setFormToDelete(null);
      },
      onError: () => {
        setDeleteModalOpen(false);
        setFormToDelete(null);
      },
    });
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFormToDelete(null);
  };

  const handleSetDefault = (form: any) => {
    setDefaultForm.mutate({
      userId,
      formType: form.form_type,
      formId: form.lead_form_id,
    });
    handleMenuClose();
  };

  const handleTogglePause = (form: any) => {
    togglePause.mutate({
      formId: form.lead_form_id,
      disabled: !form.disabled,
    });
    handleMenuClose();
  };

  const handleToggleAutoGen = (form: any) => {
    toggleAutoGenerate.mutate({
      formId: form.lead_form_id,
      autoGenerate: !form.auto_generate,
    });
    handleMenuClose();
  };

  const getFormTypeLabel = (type: FormTypeEnum) => {
    const labels = {
      [FormTypeEnum.PERSON]: 'Individual',
      [FormTypeEnum.ORGANIZATION]: 'Organization',
      [FormTypeEnum.BUSINESS]: 'Business',
      [FormTypeEnum.CONVERSATIONAL]: 'Sales Signals',
      [FormTypeEnum.GOOGLE_MAPS]: 'Google Maps',
    };
    return labels[type] || type;
  };

  const getFormTypeColor = (type: FormTypeEnum) => {
    const colors = {
      [FormTypeEnum.PERSON]: '#3B82F6',
      [FormTypeEnum.ORGANIZATION]: '#8B5CF6',
      [FormTypeEnum.BUSINESS]: '#10B981',
      [FormTypeEnum.CONVERSATIONAL]: '#F59E0B',
      [FormTypeEnum.GOOGLE_MAPS]: '#EF4444',
    };
    return colors[type] || '#6B7280';
  };

  const getFormTypeIcon = (type: FormTypeEnum) => {
    const icons = {
      [FormTypeEnum.PERSON]: <FaUser size={20} />,
      [FormTypeEnum.ORGANIZATION]: <FaBuilding size={20} />,
      [FormTypeEnum.BUSINESS]: <FaBriefcase size={20} />,
      [FormTypeEnum.CONVERSATIONAL]: <FaComments size={20} />,
      [FormTypeEnum.GOOGLE_MAPS]: <FaMapMarkerAlt size={20} />,
    };
    return icons[type] || <FaUser size={20} />;
  };

  const handleCreateNew = () => {
    router.push('/leads-tracking/forms/manage?type=individual&mode=create');
  };

  const filterButtons = [
    { label: 'All Forms', value: 'all' },
    { label: 'Individual', value: FormTypeEnum.PERSON },
    { label: 'Organization', value: FormTypeEnum.ORGANIZATION },
    { label: 'Sales Signals', value: FormTypeEnum.CONVERSATIONAL },
  ];

  const renderFormCard = (form: any) => (
    <Card
      key={form.lead_form_id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid #F3F4F6',
        borderRadius: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          boxShadow: `0 12px 24px ${LightThemeColors.uriColor}15`,
          transform: 'translateY(-4px)',
          borderColor: `${LightThemeColors.uriColor}30`,
        },
        ...(form.is_default && {
          boxShadow: `0 4px 12px ${LightThemeColors.uriColor}20`,
          borderColor: `${LightThemeColors.uriColor}40`,
        }),
      }}
    >
      {/* Clean header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '1px solid #F0F1F3',
          background: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                backgroundColor: getFormTypeColor(form.form_type),
                borderRadius: '8px',
                width: 36,
                height: 36,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#FFFFFF',
                boxShadow: `0 2px 6px ${getFormTypeColor(form.form_type)}40`,
              }}
            >
              {getFormTypeIcon(form.form_type)}
            </Box>
            <Chip
              label={getFormTypeLabel(form.form_type)}
              size="small"
              sx={{
                backgroundColor: `${getFormTypeColor(form.form_type)}10`,
                color: getFormTypeColor(form.form_type),
                fontWeight: 600,
                fontSize: '11px',
                border: `1px solid ${getFormTypeColor(form.form_type)}30`,
                height: 22,
              }}
            />
          </Box>
          <IconButton
            size="small"
            onClick={(e) => handleMenuOpen(e, form)}
            sx={{
              color: '#9CA3AF',
              '&:hover': {
                backgroundColor: '#F9FAFB',
                color: LightThemeColors.uriColor,
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title with Default Star */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              color: '#111827',
              flexGrow: 1,
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {form.form_title || 'Untitled Form'}
          </Typography>
          {form.is_default && (
            <Tooltip title="Default Form">
              <StarIcon sx={{ fontSize: 18, color: '#FCD34D', flexShrink: 0 }} />
            </Tooltip>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Compact Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            px: 1.75,
            py: 1.25,
            background: '#FAFBFC',
            borderRadius: '10px',
            border: '1px solid #F0F1F3',
          }}
        >
          <Box>
            <Typography fontSize="9px" color="#9CA3AF" fontWeight={600} textTransform="uppercase" letterSpacing="0.8px" mb={0.25} lineHeight={1}>
              Total Leads
            </Typography>
            <Typography fontSize="22px" fontWeight={700} color="#374151" lineHeight={1} letterSpacing="-0.02em">
              {form.total_leads || 0}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '1px',
              height: '30px',
              background: 'linear-gradient(180deg, transparent 0%, #E5E7EB 20%, #E5E7EB 80%, transparent 100%)',
            }}
          />
          <Box>
            <Typography fontSize="9px" color="#10B981" fontWeight={600} textTransform="uppercase" letterSpacing="0.8px" mb={0.25} lineHeight={1}>
              New Today
            </Typography>
            <Typography fontSize="22px" fontWeight={700} color="#10B981" lineHeight={1} letterSpacing="-0.02em">
              {form.total_new_leads || 0}
            </Typography>
          </Box>
        </Box>

        {/* Status Badges - More Subtle */}
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
          {form.disabled ? (
            <Chip
              icon={<PauseIcon sx={{ fontSize: 12 }} />}
              label="Paused"
              size="small"
              sx={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontSize: '10px',
                fontWeight: 600,
                height: 22,
              }}
            />
          ) : (
            <Chip
              icon={<PlayArrowIcon sx={{ fontSize: 12 }} />}
              label="Active"
              size="small"
              sx={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                fontSize: '10px',
                fontWeight: 600,
                height: 22,
              }}
            />
          )}
          {form.auto_generate && (
            <Chip
              icon={<AutorenewIcon sx={{ fontSize: 12 }} />}
              label="Auto-Gen"
              size="small"
              sx={{
                backgroundColor: '#DBEAFE',
                color: '#1E40AF',
                fontSize: '10px',
                fontWeight: 600,
                height: 22,
              }}
            />
          )}
        </Box>

        {/* Footer with Date */}
        <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '10px', display: 'block', fontWeight: 500 }}>
          Updated {form.last_updated ? new Date(form.last_updated).toLocaleDateString() : 'N/A'}
        </Typography>
      </CardContent>

      {/* Clean Action Footer */}
      <Box
        sx={{
          borderTop: '1px solid #F3F4F6',
          p: 1.75,
          display: 'flex',
          gap: 1.25,
          backgroundColor: '#FAFBFC',
        }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<EditIcon sx={{ fontSize: 15 }} />}
          onClick={() => handleEditForm(form)}
          sx={{
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 600,
            flexGrow: 1,
            background: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, #a31560 100%)`,
            boxShadow: `0 2px 6px ${LightThemeColors.uriColor}30`,
            '&:hover': {
              background: `linear-gradient(135deg, #a31560 0%, ${LightThemeColors.uriColor} 100%)`,
              boxShadow: `0 4px 10px ${LightThemeColors.uriColor}40`,
            },
            borderRadius: '8px',
            py: 0.9,
          }}
        >
          Edit Form
        </Button>
        <Tooltip title={form.is_default ? 'Already Default' : 'Set as Default'}>
          <span>
            <IconButton
              size="small"
              onClick={() => handleSetDefault(form)}
              disabled={form.is_default}
              sx={{
                color: form.is_default ? '#FCD34D' : '#9CA3AF',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: form.is_default ? '#FCD34D' : LightThemeColors.uriColor,
                },
                '&.Mui-disabled': {
                  backgroundColor: '#FFF7ED',
                  borderColor: '#FCD34D',
                },
              }}
            >
              {form.is_default ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5, fontSize: { xs: '24px', md: '30px' } }}>
              Manage All Forms
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: 500 }}>
              Create, edit, and organize all your lead generation forms in one place
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              backgroundColor: LightThemeColors.uriColor,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.2,
              borderRadius: '10px',
              boxShadow: '0px 4px 12px rgba(205, 27, 120, 0.3)',
              '&:hover': {
                backgroundColor: '#A31560',
                boxShadow: '0px 6px 16px rgba(205, 27, 120, 0.4)',
              },
            }}
          >
            Create New Form
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {[
            { label: 'Total Forms', value: formStats.total, color: LightThemeColors.uriColor, icon: <FilterAltIcon /> },
            { label: 'Total Leads', value: formStats.totalLeads, color: '#10B981', icon: <TrendingUpIcon /> },
            { label: 'Individual', value: formStats[FormTypeEnum.PERSON], color: '#3B82F6', icon: <FaUser /> },
            { label: 'Organization', value: formStats[FormTypeEnum.ORGANIZATION], color: '#8B5CF6', icon: <FaBuilding /> },
            { label: 'Sales Signals', value: formStats[FormTypeEnum.CONVERSATIONAL], color: '#F59E0B', icon: <FaComments /> },
          ].map((stat) => (
            <Grid item xs={6} sm={6} md={2.4} key={stat.label}>
              <Card
                sx={{
                  border: '1px solid #F3F4F6',
                  borderRadius: '12px',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  height: '100%',
                  background: '#FAFBFC',
                  '&:hover': {
                    boxShadow: `0 4px 12px ${stat.color}15`,
                    transform: 'translateY(-2px)',
                    background: '#fff',
                  },
                }}
              >
                <CardContent sx={{ p: 2.25 }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}15`,
                        borderRadius: '10px',
                        width: 44,
                        height: 44,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: stat.color,
                        fontSize: '18px',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', mb: 0.5 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, fontSize: '28px', lineHeight: 1, letterSpacing: '-0.01em' }}>
                    {isLoading ? <Skeleton width={40} /> : stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filters */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search forms by title..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#F9FAFB',
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                },
              },
              mb: 2,
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filterButtons.map((btn) => (
              <Button
                key={btn.value}
                size="small"
                variant={filterType === btn.value ? 'contained' : 'outlined'}
                onClick={() => setFilterType(btn.value as any)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  fontSize: '13px',
                  ...(filterType === btn.value
                    ? {
                        backgroundColor: LightThemeColors.uriColor,
                        borderColor: LightThemeColors.uriColor,
                        '&:hover': {
                          backgroundColor: '#A31560',
                        },
                      }
                    : {
                        borderColor: '#E5E7EB',
                        color: '#6B7280',
                        '&:hover': {
                          backgroundColor: '#F9FAFB',
                          borderColor: LightThemeColors.uriColor,
                        },
                      }),
                }}
              >
                {btn.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Forms Grid */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={320} sx={{ borderRadius: '12px' }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredForms.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            border: '2px dashed #E5E7EB',
          }}
        >
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 1, fontWeight: 600 }}>
            {searchQuery || filterType !== 'all' ? 'No forms match your filters' : 'No forms created yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
            {searchQuery || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Get started by creating your first lead form'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              backgroundColor: LightThemeColors.uriColor,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#A31560' },
            }}
          >
            Create Your First Form
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredForms.map((form: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={form.lead_form_id}>
              {renderFormCard(form)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '10px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={() => selectedForm && handleEditForm(selectedForm)} sx={{ fontSize: '14px', fontWeight: 500, gap: 1.5, py: 1.2 }}>
          <EditIcon fontSize="small" sx={{ color: '#6B7280' }} />
          Edit Form
        </MenuItem>
        <MenuItem onClick={() => selectedForm && handleSetDefault(selectedForm)} disabled={selectedForm?.is_default} sx={{ fontSize: '14px', fontWeight: 500, gap: 1.5, py: 1.2 }}>
          <StarIcon fontSize="small" sx={{ color: selectedForm?.is_default ? '#FCD34D' : '#6B7280' }} />
          Set as Default
        </MenuItem>
        <MenuItem onClick={() => selectedForm && handleTogglePause(selectedForm)} sx={{ fontSize: '14px', fontWeight: 500, gap: 1.5, py: 1.2 }}>
          {selectedForm?.disabled ? (
            <>
              <PlayArrowIcon fontSize="small" sx={{ color: '#10B981' }} />
              Resume
            </>
          ) : (
            <>
              <PauseIcon fontSize="small" sx={{ color: '#F59E0B' }} />
              Pause
            </>
          )}
        </MenuItem>
        <MenuItem onClick={() => selectedForm && handleToggleAutoGen(selectedForm)} sx={{ fontSize: '14px', fontWeight: 500, gap: 1.5, py: 1.2 }}>
          <AutorenewIcon fontSize="small" sx={{ color: '#3B82F6' }} />
          {selectedForm?.auto_generate ? 'Disable' : 'Enable'} Auto-Gen
        </MenuItem>
        <MenuItem onClick={() => selectedForm && handleDeleteForm(selectedForm.lead_form_id, selectedForm.form_title)} sx={{ fontSize: '14px', fontWeight: 500, gap: 1.5, py: 1.2, color: '#EF4444' }}>
          <DeleteIcon fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        spamTitle={formToDelete?.title}
        isProcessing={deleteLeadForm.isPending}
        title="Delete Lead Form"
        description="Are you sure you want to permanently delete this lead form? This will also delete all associated leads and cannot be undone."
        itemLabel="Form Name"
      />
    </Container>
  );
};

export default ManageAllFormsView;
