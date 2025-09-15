import SeoHead from '@/components/atoms/SeoHead';
import TeamsList from '@/features/teams/teams-list';

const TeamsPage = () => {
  return (
    <>
      <SeoHead title="Teams" />
      <TeamsList />;
    </>
  );
};

export default TeamsPage;
