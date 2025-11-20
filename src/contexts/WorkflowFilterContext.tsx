import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface WorkflowFilterContextType {
  selectedWorkflows: string[];
  setSelectedWorkflows: (workflows: string[]) => void;
}

const WorkflowFilterContext = createContext<WorkflowFilterContextType | undefined>(undefined);

export const WorkflowFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [selectedWorkflows, setSelectedWorkflowsState] = useState<string[]>([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedWorkflows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSelectedWorkflowsState(parsed);
        }
      } catch (e) {
        // Silently fail and continue with empty array
      }
    }
  }, []);

  // Sync with dashboard URL query params
  useEffect(() => {
    if (router.pathname === '/dashboard') {
      if (router.query.workflow) {
        // User has selected workflows on dashboard
        const workflowsFromUrl = (router.query.workflow as string).split(',').filter(Boolean);
        setSelectedWorkflowsState(workflowsFromUrl);
        localStorage.setItem('selectedWorkflows', JSON.stringify(workflowsFromUrl));
      }
      // Note: We DON'T clear when there's no query param on dashboard
      // This preserves the selection when navigating back to dashboard from a module
    }
  }, [router.pathname, router.query.workflow]);

  const setSelectedWorkflows = (workflows: string[]) => {
    setSelectedWorkflowsState(workflows);
    if (workflows.length > 0) {
      localStorage.setItem('selectedWorkflows', JSON.stringify(workflows));
    } else {
      localStorage.removeItem('selectedWorkflows');
    }
  };

  return (
    <WorkflowFilterContext.Provider value={{ selectedWorkflows, setSelectedWorkflows }}>
      {children}
    </WorkflowFilterContext.Provider>
  );
};

export const useWorkflowFilter = () => {
  const context = useContext(WorkflowFilterContext);
  if (context === undefined) {
    throw new Error('useWorkflowFilter must be used within a WorkflowFilterProvider');
  }
  return context;
};
