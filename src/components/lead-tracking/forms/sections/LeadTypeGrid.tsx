import LeadTypeCard from './LeadTypeCard';

const LeadTypeGrid = () => {
  return (
    <LeadTypeCard
      colorMap={{
        individual: '#f8fafc', // gray-50
        organization: '#f7f7f7', // gray-100
        business: '#f9f7f7', // gray-150
        conversational: '#f9fafb', // gray-150
      }}
    />
  );
};

export default LeadTypeGrid;
