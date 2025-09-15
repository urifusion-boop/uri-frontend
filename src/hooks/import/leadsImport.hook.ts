import { ImportsService } from '@/api/ImportsService';
import { queryClient } from '@/configs/query-client.config';
import { LeadImportConfirmDto, LeadImportDto } from '@/models/dtos/LeadImportDto';
import { ImportTypeEnum } from '@/models/enum-models/ImportTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

const useLeadsImport = () => {
  const [importId, setImportId] = useState<string | null>(null);
  const { userDetails } = useAuth();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Processing');

  const uploadLeadsFile = useMutation({
    mutationFn: async (data: LeadImportDto) => {
      const res = await ImportsService.uploadLeadsFile(data);
      if (res?.responseData?.data?.importId) {
        setImportId(res.responseData.data.importId);
      }
      return res;
    },
  });

  const getImportStatus = useMutation({
    mutationFn: async () => {
      const res = await ImportsService.getImportStatus(userDetails?.id ?? '', ImportTypeEnum.LEAD);
      if (res?.responseData) {
        setProgress(res.responseData.progress);
        setStatus(res.responseData.status);
      }
      return res;
    },
  });

  const confirmImport = useMutation({
    mutationFn: async (data: LeadImportConfirmDto) => {
      const res = await ImportsService.confirmImport(data);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-forms'] });
    },
  });

  return {
    importId,
    setImportId,
    progress,
    status,
    uploadLeadsFile,
    getImportStatus,
    confirmImport,
  };
};

export default useLeadsImport;
