import { LeadDto } from '@/models/dtos/LeadsDto';
import { DateFilterEnum } from '@/models/enum-models/DateFIlterEnum';
import { create } from 'zustand';

interface LeadStoreState {
  leadStatus: string | null;
  setLeadStatus: (status: string | null) => void;
  interestLevel: string | null;
  setInterestLevel: (level: string | null) => void;
  dateFilter: string | null;
  setDateFilter: (filter: string | null) => void;
  leadsDateFilter: string | null;
  setLeadsDateFilter: (filter: string | null) => void;
  leadSource: string | null;
  setLeadSource: (source: string | null) => void;
  leadStarred: string | null;
  setLeadStarred: (starred: string | null) => void;
  leadsData: LeadDto[] | null;
  leadType: string | null;
  setLeadType: (type: string | null) => void;
  setLeadsData: (update: LeadDto[] | ((prev: LeadDto[]) => LeadDto[])) => void;
  clearFilters: () => void;
}

export const useLeadTrackingStore = create<LeadStoreState>((set) => ({
  leadStatus: null,
  setLeadStatus: (status) => set({ leadStatus: status }),
  interestLevel: null,
  setInterestLevel: (level) => set({ interestLevel: level }),
  dateFilter: DateFilterEnum.LAST_1_MONTH,
  setDateFilter: (filter) => set({ dateFilter: filter }),
  leadsDateFilter: null,
  setLeadsDateFilter: (filter) => set({ leadsDateFilter: filter }),
  leadSource: null,
  setLeadSource: (source) => set({ leadSource: source }),
  leadStarred: 'all',
  setLeadStarred: (starred) => set({ leadStarred: starred }),
  leadsData: null,
  leadType: null,
  setLeadType: (type) => set({ leadType: type }),
  setLeadsData: (update) =>
    set((state) => ({
      leadsData: typeof update === 'function' ? update(state.leadsData || []) : update,
    })),
  clearFilters: () =>
    set({
      leadStatus: null,
      interestLevel: null,
      dateFilter: null,
      leadsDateFilter: null,
      leadSource: null,
      leadStarred: 'all',
      leadType: null,
    }),
}));
