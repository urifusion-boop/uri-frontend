import { UriHttpClient } from '@/configs/http.config';
import { BackendUrlEnum } from '@/models/enum-models/BackendUrlEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';

export const useUserWorkflows = () => {
  const { userDetails } = useAuth();
  const [enabledWorkflows, setEnabledWorkflows] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!userDetails?.userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await UriHttpClient.getClient().get(`${BackendUrlEnum.BACKEND}/users/${userDetails.userId}/workflows`);

        if (response.data.status && response.data.responseData) {
          setEnabledWorkflows(response.data.responseData.enabledWorkflows || []);
        }
      } catch (err) {
        // Fallback to userDetails if available
        setEnabledWorkflows(userDetails.enabledWorkflows || []);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [userDetails?.userId]);

  return { enabledWorkflows, loading };
};
