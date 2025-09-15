import { FormSnapshotResponseDto } from '@/models/dtos/LeadsDto';

import { useLeadFormSnapshotHook } from '@/hooks/lead-form-snapshot/leadFormSnapshot.hook';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import FormListTable from './FormListTable';

const FormSnapshotTab = ({ leadType }: { leadType?: LeadTypeEnum }) => {
  const { userDetails } = useAuth();
  const formSnapshotHookData = useLeadFormSnapshotHook();
  //if leadtype is undefined, then get all form snapshots
  const formSnapshotQuery = formSnapshotHookData.useGetLeadFormSnapshotsByFilters({
    ...(leadType && { form_type: leadType }),
    user_id: userDetails?.userId,
    page: 1,
    per_page: 10,
  });

  const handleRefresh = () => {
    formSnapshotQuery.refetch();
  };

  const data = formSnapshotQuery.data as FormSnapshotResponseDto;
  return (
    <div className="transition-all duration-300 ease-in-out">
      <div className="transition-all duration-300 ease-in-out">
        <FormListTable data={data?.data ?? []} page={1} setPage={() => {}} search={''} setSearch={() => {}} total={data?.total ?? 0} handleRefresh={handleRefresh} />
      </div>
    </div>
  );
};

export default FormSnapshotTab;
