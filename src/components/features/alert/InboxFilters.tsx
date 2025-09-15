import { Box, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

interface InboxFiltersProps {
  selectedInboxFilter: string;
  setSelectedInboxFilter: Dispatch<SetStateAction<string>>;
  selectedFilter: string;
}

const InboxFilters = ({ selectedInboxFilter, setSelectedInboxFilter, selectedFilter }: InboxFiltersProps) => {
  const filters = ['All', 'Read', 'Unread'];

  return (
    <div>
      <Typography className="text-[20px] font-semibold mb-4 text-black">Inbox</Typography>
      {/* <div className="relative flex items-center px-[12px] space-x-[1.5px] rounded-[10px] py-[13.5px] bg-[#D4D4D433] mb-3 md:mb-6">
        <SearchOutlinedIcon fontSize="small" />
        <input
          type="text"
          className="bg-transparent flex-grow placeholder:text-[#9EA3AE] text-[14px]"
          placeholder="Search"
        />
      </div> */}
      {selectedFilter === 'inbox' && (
        <div className="bg-[#f6f6f6] p-2 flex justify-between rounded-[10px] mb-3">
          {filters.map((filter) => (
            <Box
              component="button"
              key={filter}
              onClick={() => setSelectedInboxFilter(filter)}
              className={`text-[14px] font-semibold  px-3 rounded-md py-1 ${selectedInboxFilter === filter ? 'bg-[#CD1B78] text-white' : 'bg-transparent text-[#404243]'}`}
            >
              {filter}
            </Box>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxFilters;
