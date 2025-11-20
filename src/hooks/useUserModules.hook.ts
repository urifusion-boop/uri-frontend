import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { UserModuleService } from '@/api/UserModuleService';

export const useUserModules = () => {
  const { userDetails } = useAuth();
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserModules = async () => {
      if (!userDetails?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await UserModuleService.getEnabledModules(userDetails.userId);

        if (response.status && response.responseData) {
          // Handle both array and object with modules property
          const modules = Array.isArray(response.responseData)
            ? response.responseData
            : (response.responseData as any).modules || [];

          // Extract module IDs from the response
          const moduleIds = modules
            .filter((module: any) => module.enabled)
            .map((module: any) => module.moduleId);
          setSelectedModules(moduleIds);
        } else {
          setError(response.responseMessage || 'Failed to fetch modules');
        }
      } catch (err: any) {
        console.error('Error fetching user modules:', err);
        setError(err?.response?.data?.responseMessage || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserModules();
  }, [userDetails?.userId]);

  return { selectedModules, loading, error };
};
