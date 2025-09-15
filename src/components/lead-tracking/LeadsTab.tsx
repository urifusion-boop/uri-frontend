import { GetByFiltersLeadsDto, LeadDto } from '@/models/dtos/LeadsDto';
import { ViewColumn, ViewModule } from '@mui/icons-material';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';

import { LightThemeColors } from '@/configs/colors.config';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useLeadTrackingStore } from '@/store/leads-tracking/useLeadTrackingStore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { UseQueryResult } from '@tanstack/react-query';
import Select from '../atoms/Select';
import LeadKanban from '../features/alert/LeadKanban';
import SingleFieldInput from '../input/SingleFieldInput';
import BusinessTableCard from './BusinessTableCard';
import ConversationalTableCard from './ConversationalTableCard';
import IndividualTableCard from './IndividualTableCard';
import OrganizationTableCard from './OrganizationTableCard';

interface LeadsTabProps {
  setLayout: (value: string) => void;
  isGettingLeads: boolean;
  page: number;
  pageSize: number;
  leadsData: UseQueryResult<GetByFiltersLeadsDto | null | undefined, unknown>;
  allLeads: (LeadDto | undefined)[];
  getPaginationFunction: any;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  search: string;
  setSearch: (value: string) => void;
  layout: string;
  leadType?: LeadTypeEnum;
  refresh?: () => void;
}

const LeadsTab = ({ allLeads, leadsData, isGettingLeads, getPaginationFunction, page, pageSize, setPage, setPageSize, search, setSearch, layout, setLayout, leadType, refresh }: LeadsTabProps) => {
  const filtersStore = useLeadTrackingStore((state) => state);

  return (
    <Box className="bg-white h-full p-4 border-l">
      <Box className="flex items-center justify-between">
        <Typography className="text-2xl font-medium">{leadsData?.data?.total} Leads</Typography>
      </Box>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'flex',
          flexWrap: { xs: 'nowrap', md: 'wrap' },
          overflowX: { xs: 'auto', md: 'visible' },
          gap: 2,
          alignItems: 'center',
          pb: 1,
          mt: 2,
          width: '100%',
          '& > *': { flexShrink: 0 }, // prevent shrinking
        }}
      >
        {layout === 'row' ? (
          <>
            <Box className="flex items-center gap-3">
              <Box className="mt-4 flex gap-3">
                <Select
                  options={Object.values(LeadStatusEnum).map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  placeholder="Lead Status"
                  onChange={(value) => filtersStore.setLeadStatus(value)}
                  value={filtersStore.leadStatus ?? ''}
                  containerClassName="max-w-[150px] w-full min-w-[120px]"
                />
                <Select
                  options={[
                    { value: 'High', label: 'High' },
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                  ]}
                  placeholder="Interests Level"
                  onChange={(value) => filtersStore.setInterestLevel(value)}
                  value={filtersStore.interestLevel ?? ''}
                  containerClassName="max-w-[300px] w-full"
                />
              </Box>
              <Box className="flex items-center gap-3 ml-3 mb-3">
                <SingleFieldInput value={search} setValue={(e) => setSearch(e)} placeholder="Search" required={false} />
              </Box>
            </Box>
            {/* <Box className="border rounded-lg p-2 w-[25%] px-3 flex items-center gap-2 font-urbanist">
              <SearchIcon />
              <input type="text" placeholder="Search" className="w-full outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box> */}
          </>
        ) : (
          <Box />
        )}
        <Box className="flex gap-3 items-center ml-2">
          <Box className="flex-1" />
          <IconButton onClick={refresh} sx={{ border: '1px solid #f5dbb3', background: '#fff', borderRadius: 2, height: 36, width: 36 }}>
            <RefreshIcon sx={{ color: LightThemeColors.uriColor }} />
          </IconButton>
          <Box className="flex items-center gap-3">
            <Box className="flex gap-2 items-center">
              <Box className="border rounded-lg overflow-hidden flex">
                <button onClick={() => setLayout('column')} className={`p-2 transition-all ${layout === 'column' ? 'bg-gray-100 text-primary-600' : 'hover:bg-gray-50'}`}>
                  <ViewColumn />
                </button>
                <button onClick={() => setLayout('row')} className={`p-2 transition-all ${layout === 'row' ? 'bg-gray-100 text-primary-600' : 'hover:bg-gray-50'}`}>
                  <ViewModule />
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {isGettingLeads ? (
        <Box
          sx={{
            height: '60vh',
            mt: 4,
          }}
        >
          <Skeleton variant="rectangular" sx={{ height: '100%' }} animation="wave" />
        </Box>
      ) : (
        <Box className="transition-all duration-300 ease-in-out">
          {layout === 'column' ? (
            <LeadKanban leads={(allLeads ?? []) as LeadDto[]} getPaginationFunction={getPaginationFunction} />
          ) : leadType === LeadTypeEnum.PERSON ? (
            <IndividualTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : leadType === LeadTypeEnum.ORGANIZATION ? (
            <OrganizationTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : leadType === LeadTypeEnum.BUSINESS ? (
            <BusinessTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : leadType === LeadTypeEnum.CONVERSATIONAL ? (
            <ConversationalTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default LeadsTab;
