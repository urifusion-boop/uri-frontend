import SeoHead from '@/components/atoms/SeoHead';
import ManageRoles from '@/features/teams/manage-roles';

const ManageRolesPage = () => {
  return (
    <>
      <SeoHead title="Team Roles" />
      <ManageRoles />;
    </>
  );
};

export default ManageRolesPage;
