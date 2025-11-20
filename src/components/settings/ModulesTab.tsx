import { Box, Chip, Grid, Typography, Collapse, IconButton, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { UserService } from '@/api/UserService';
import { WorkflowAnalyticsService, UserWorkflowStats } from '@/api/WorkflowAnalyticsService';
import CustomButton from '@/components/atoms/CustomButton';
import LoaderWrapper from '@/components/atoms/LoaderWrapper';
import { WORKFLOWS, WORKFLOW_LIST } from '@/constants/workflows';
import { useAuth } from '@/providers/AuthProvider';

const WORKFLOW_NAMES: Record<string, string> = {
  'social-listening': 'Social Listening',
  'lead-generation': 'Lead Generation',
  'crm': 'CRM',
};

const ModulesTab = () => {
  const { userDetails } = useAuth();
  const [enabledWorkflows, setEnabledWorkflows] = useState<string[]>([]);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [primaryWorkflow, setPrimaryWorkflow] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userStats, setUserStats] = useState<UserWorkflowStats | null>(null);
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUserWorkflows = async () => {
      if (!userDetails?.userId) {
        setLoading(false);
        return;
      }

      try {
        const [workflowsRes, statsRes] = await Promise.all([
          UserService.getUserWorkflows(userDetails.userId),
          WorkflowAnalyticsService.getUserWorkflowStats(userDetails.userId),
        ]);

        if (workflowsRes.status && workflowsRes.responseData) {
          setEnabledWorkflows(workflowsRes.responseData.enabledWorkflows || []);
          setEnabledModules(workflowsRes.responseData.enabledModules || []);
          setPrimaryWorkflow(workflowsRes.responseData.primaryWorkflow || '');
        } else {
          toast.error('Failed to load workflows');
        }

        if (statsRes.status && statsRes.responseData) {
          setUserStats(statsRes.responseData);
        }
      } catch (error) {
        console.error('Error fetching user workflows:', error);
        toast.error('Failed to load your workflows');
      } finally {
        setLoading(false);
      }
    };

    fetchUserWorkflows();
  }, [userDetails?.userId]);

  const handleWorkflowToggle = async (workflowId: string) => {
    const workflow = WORKFLOWS[workflowId];

    // Check if coming soon
    if (workflow.comingSoon) {
      toast.info(`${workflow.name} is coming soon! 🚀`);
      return;
    }

    const isCurrentlyEnabled = enabledWorkflows.includes(workflowId);

    if (isCurrentlyEnabled) {
      // Don't allow removing if it's the only workflow
      if (enabledWorkflows.length === 1) {
        toast.error('You must have at least one workflow enabled');
        return;
      }

      // Don't allow removing primary workflow without setting a new one first
      if (workflowId === primaryWorkflow) {
        toast.error('Please set a different workflow as primary before removing this one');
        return;
      }
    }

    // Remove workflow
    if (isCurrentlyEnabled) {
      try {
        setSaving(true);
        const response = await UserService.removeWorkflow(userDetails.userId, workflowId);

        if (response.status) {
          setEnabledWorkflows(prev => prev.filter(w => w !== workflowId));
          toast.success(`${workflow.name} removed successfully`);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.responseMessage || 'Failed to remove workflow');
      } finally {
        setSaving(false);
      }
    } else {
      // Add workflow
      try {
        setSaving(true);
        const response = await UserService.addWorkflow(userDetails.userId, workflowId);

        if (response.status) {
          setEnabledWorkflows(prev => [...prev, workflowId]);

          // If this is the first workflow, make it primary
          if (enabledWorkflows.length === 0) {
            setPrimaryWorkflow(workflowId);
          }

          toast.success(`${workflow.name} added successfully! All modules are now enabled.`);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.responseMessage || 'Failed to add workflow');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSetPrimary = async (workflowId: string) => {
    if (workflowId === primaryWorkflow) {
      toast.info('This is already your primary workflow');
      return;
    }

    if (!enabledWorkflows.includes(workflowId)) {
      toast.error('Please enable this workflow first');
      return;
    }

    try {
      const response = await UserService.setPrimaryWorkflow(userDetails.userId, workflowId);

      if (response.status) {
        setPrimaryWorkflow(workflowId);
        toast.success(`${WORKFLOWS[workflowId].name} is now your primary workflow`);
      } else {
        toast.error(response.responseMessage || 'Failed to update primary workflow');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.responseMessage || 'Failed to update primary workflow');
    }
  };

  const handleModuleToggle = async (workflowId: string, moduleId: string) => {
    const isCurrentlyEnabled = enabledModules.includes(moduleId);
    const workflow = WORKFLOWS[workflowId];
    const workflowModules = workflow.modules.map(m => m.id);
    const enabledWorkflowModules = enabledModules.filter(m => workflowModules.includes(m));

    if (isCurrentlyEnabled && enabledWorkflowModules.length === 1) {
      toast.error('You must have at least one module enabled per workflow');
      return;
    }

    // Remove module
    if (isCurrentlyEnabled) {
      try {
        setSaving(true);
        const response = await UserService.removeModule(userDetails.userId, moduleId);

        if (response.status) {
          setEnabledModules(prev => prev.filter(m => m !== moduleId));
          toast.success('Module removed successfully');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.responseMessage || 'Failed to remove module');
      } finally {
        setSaving(false);
      }
    } else {
      // Add module
      try {
        setSaving(true);
        const response = await UserService.addModule(userDetails.userId, moduleId);

        if (response.status) {
          setEnabledModules(prev => [...prev, moduleId]);
          toast.success('Module added successfully');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.responseMessage || 'Failed to add module');
      } finally {
        setSaving(false);
      }
    }
  };

  const toggleWorkflowExpansion = (workflowId: string) => {
    setExpandedWorkflows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workflowId)) {
        newSet.delete(workflowId);
      } else {
        newSet.add(workflowId);
      }
      return newSet;
    });
  };

  return (
    <Box
      sx={{
        maxWidth: '930px',
        width: '100%',
        margin: 'auto',
        borderRadius: '12px',
        backgroundColor: '#fff',
        py: '24px',
        boxShadow: '-1px -1px 10px 2px #0000000D',
        px: '14px',
      }}
    >
      <Typography
        sx={{
          fontSize: 'clamp(1.375rem, 1.3232rem + 0.221vw, 1.5rem)',
          fontWeight: 600,
          color: '#404040',
          mb: '6px',
          px: {
            xs: '14px',
            md: '26px',
          },
          mt: '24px',
        }}
      >
        Manage Workflows
      </Typography>
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: 500,
          color: '#3B3B3B',
          px: {
            xs: '14px',
            md: '26px',
          },
          mb: 2,
        }}
      >
        Enable workflows to access their features. Your primary workflow determines your default landing page.
      </Typography>

      {/* Status Indicator */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#CD1B78' }}>
          {enabledWorkflows.length} {enabledWorkflows.length === 1 ? 'workflow' : 'workflows'} enabled
        </Typography>
        {primaryWorkflow && (
          <Typography sx={{ fontSize: 14, color: '#666' }}>
            • Primary: {WORKFLOWS[primaryWorkflow]?.name}
          </Typography>
        )}
      </Box>

      {/* Workflows Grid */}
      <Box
        sx={{
          mt: '40px',
          px: {
            xs: '14px',
            md: '26px',
          },
        }}
      >
        <LoaderWrapper
          isLoading={loading}
          numberOfSkeletons={3}
          skeletonHeight="280px"
          skeletonWidth="100%"
          isGrid
          gridColumns={3}
        >
          <Grid container spacing={3}>
            {WORKFLOW_LIST.map((workflow) => {
              const isEnabled = enabledWorkflows.includes(workflow.id);
              const isPrimary = workflow.id === primaryWorkflow;
              const IconComponent = workflow.icon;

              return (
                <Grid item xs={12} sm={6} md={4} key={workflow.id}>
                  <Box
                    sx={{
                      border: isEnabled ? '2px solid #CD1B78' : '1px solid #E0E0E0',
                      backgroundColor: isEnabled ? '#FFF0F8' : '#fff',
                      borderRadius: '20px',
                      padding: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      minHeight: '280px',
                      boxShadow: '1px 1px 6px 3px #00000011',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      opacity: workflow.comingSoon ? 0.6 : 1,
                    }}
                  >
                    {/* Status Badges */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        alignItems: 'flex-end',
                      }}
                    >
                      {isPrimary && (
                        <Chip
                          label="Primary"
                          size="small"
                          sx={{
                            backgroundColor: '#CD1B78',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      )}
                      {workflow.comingSoon && (
                        <Chip
                          label="Coming Soon"
                          size="small"
                          sx={{
                            backgroundColor: '#FFA726',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '11px',
                          }}
                        />
                      )}
                      {isEnabled && !isPrimary && (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: '#CD1B78',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FaCheck color="#fff" size={14} />
                        </Box>
                      )}
                    </Box>

                    {/* Icon */}
                    <IconComponent style={{ color: '#CD1B78', width: 50, height: 50 }} />

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: '#333',
                          mb: 1,
                        }}
                      >
                        {workflow.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 14,
                          color: '#666',
                          lineHeight: 1.4,
                          mb: 2,
                        }}
                      >
                        {workflow.description}
                      </Typography>

                      {/* Module List - Expandable */}
                      {workflow.modules.length > 0 && isEnabled && (
                        <Box sx={{ mt: 2 }}>
                          <Box
                            onClick={() => toggleWorkflowExpansion(workflow.id)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              p: 1.5,
                              borderRadius: '8px',
                              backgroundColor: expandedWorkflows.has(workflow.id) ? '#FFF0F8' : '#F9FAFB',
                              border: `1px solid ${expandedWorkflows.has(workflow.id) ? '#FFC2E5' : '#E5E7EB'}`,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: '#FFF0F8',
                                borderColor: '#FFC2E5',
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#CD1B78',
                              }}
                            >
                              {workflow.modules.filter(m => enabledModules.includes(m.id)).length}/{workflow.modules.length} modules • {expandedWorkflows.has(workflow.id) ? 'Collapse' : 'Expand'}
                            </Typography>
                            <IconButton size="small" sx={{ color: '#CD1B78', p: 0.5 }}>
                              {expandedWorkflows.has(workflow.id) ? (
                                <FaChevronUp size={12} />
                              ) : (
                                <FaChevronDown size={12} />
                              )}
                            </IconButton>
                          </Box>

                          <Collapse in={expandedWorkflows.has(workflow.id)}>
                            <Box sx={{ mt: 1.5, px: 1 }}>
                              {workflow.modules.map((module, index) => {
                                const isModuleEnabled = enabledModules.includes(module.id);
                                return (
                                  <Box
                                    key={module.id}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      py: 1.5,
                                      px: 2,
                                      borderRadius: '8px',
                                      mb: index < workflow.modules.length - 1 ? 1 : 0,
                                      backgroundColor: isModuleEnabled ? '#FFFFFF' : '#F9FAFB',
                                      border: `1px solid ${isModuleEnabled ? '#E5E7EB' : '#F3F4F6'}`,
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        borderColor: '#CD1B78',
                                        backgroundColor: '#FFFFFF',
                                      },
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      {isModuleEnabled && (
                                        <Box
                                          sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            backgroundColor: '#CD1B78',
                                          }}
                                        />
                                      )}
                                      <Typography
                                        sx={{
                                          fontSize: 13,
                                          color: isModuleEnabled ? '#1F2937' : '#9CA3AF',
                                          fontWeight: isModuleEnabled ? 600 : 400,
                                        }}
                                      >
                                        {module.name}
                                      </Typography>
                                    </Box>
                                    <Switch
                                      checked={isModuleEnabled}
                                      onChange={() => handleModuleToggle(workflow.id, module.id)}
                                      size="small"
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                          color: '#CD1B78',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                          backgroundColor: '#CD1B78',
                                        },
                                      }}
                                    />
                                  </Box>
                                );
                              })}
                            </Box>
                          </Collapse>
                        </Box>
                      )}

                      {/* Module List - Non-enabled workflows (read-only) */}
                      {workflow.modules.length > 0 && !isEnabled && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#999',
                              mb: 0.5,
                            }}
                          >
                            Includes:
                          </Typography>
                          {workflow.modules.map((module) => (
                            <Typography
                              key={module.id}
                              sx={{
                                fontSize: 12,
                                color: '#666',
                                lineHeight: 1.6,
                              }}
                            >
                              • {module.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {isEnabled ? (
                        <>
                          {!isPrimary && (
                            <CustomButton
                              mode="secondary"
                              onClick={() => handleSetPrimary(workflow.id)}
                              disabled={workflow.comingSoon}
                              style={{ fontSize: '13px', padding: '8px 16px' }}
                            >
                              Set as Primary
                            </CustomButton>
                          )}
                          <CustomButton
                            mode="outlined"
                            onClick={() => handleWorkflowToggle(workflow.id)}
                            disabled={workflow.comingSoon || enabledWorkflows.length === 1}
                            style={{
                              fontSize: '13px',
                              padding: '8px 16px',
                              borderColor: '#CD1B78',
                              color: '#CD1B78',
                            }}
                          >
                            Remove
                          </CustomButton>
                        </>
                      ) : (
                        <CustomButton
                          mode="primary"
                          onClick={() => handleWorkflowToggle(workflow.id)}
                          disabled={workflow.comingSoon}
                          style={{ fontSize: '13px', padding: '8px 16px' }}
                        >
                          {workflow.comingSoon ? 'Coming Soon' : 'Enable Workflow'}
                        </CustomButton>
                      )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </LoaderWrapper>
      </Box>

      {/* Info Box */}
      <Box
        sx={{
          mt: 4,
          mx: {
            xs: '14px',
            md: '26px',
          },
          p: 2,
          borderRadius: '12px',
          backgroundColor: '#F5F5F5',
        }}
      >
        <Typography sx={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
          When you enable a workflow, all its modules are automatically activated.
          Your primary workflow determines where you land when you log in.
        </Typography>
      </Box>

      {/* User Workflow Activity */}
      {userStats && userStats.workflowHistory && userStats.workflowHistory.length > 0 && (
        <Box
          sx={{
            mt: 4,
            mx: {
              xs: '14px',
              md: '26px',
            },
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: '#404040',
              mb: 2,
            }}
          >
            Your Workflow Activity
          </Typography>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              p: 2,
              boxShadow: '1px 1px 6px 3px #00000011',
            }}
          >
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600, fontSize: 14 }}>
                      Workflow
                    </th>
                    <th style={{ textAlign: 'center', padding: '12px', color: '#666', fontWeight: 600, fontSize: 14 }}>
                      Times Added
                    </th>
                    <th style={{ textAlign: 'center', padding: '12px', color: '#666', fontWeight: 600, fontSize: 14 }}>
                      Times Removed
                    </th>
                    <th style={{ textAlign: 'right', padding: '12px', color: '#666', fontWeight: 600, fontSize: 14 }}>
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userStats.workflowHistory.map((history) => (
                    <tr key={history.workflowId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: 500, fontSize: 14 }}>
                        {WORKFLOW_NAMES[history.workflowId] || history.workflowId}
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px', fontSize: 14 }}>{history.addedCount}</td>
                      <td style={{ textAlign: 'center', padding: '12px', fontSize: 14 }}>{history.removedCount}</td>
                      <td style={{ textAlign: 'right', padding: '12px', fontSize: 12, color: '#666' }}>
                        {history.lastActionDate
                          ? new Date(history.lastActionDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ModulesTab;
