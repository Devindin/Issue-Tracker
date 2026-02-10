import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SortField = 'title' | 'status' | 'priority' | 'severity' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

interface IssuesFilterState {
  searchTerm: string;
  filterStatus: string;
  filterPriority: string;
  filterSeverity: string;
  filterAssignee: string;
  filterCompletedDate: string;
  sortField: SortField;
  sortOrder: SortOrder;
}

const initialState: IssuesFilterState = {
  searchTerm: '',
  filterStatus: 'All',
  filterPriority: 'All',
  filterSeverity: 'All',
  filterAssignee: 'All',
  filterCompletedDate: 'All',
  sortField: 'createdAt',
  sortOrder: 'desc',
};

const issuesFilterSlice = createSlice({
  name: 'issuesFilter',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<string>) => {
      state.filterPriority = action.payload;
    },
    setFilterSeverity: (state, action: PayloadAction<string>) => {
      state.filterSeverity = action.payload;
    },
    setFilterAssignee: (state, action: PayloadAction<string>) => {
      state.filterAssignee = action.payload;
    },
    setFilterCompletedDate: (state, action: PayloadAction<string>) => {
      state.filterCompletedDate = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    resetFilters: (state) => {
      state.searchTerm = '';
      state.filterStatus = 'All';
      state.filterPriority = 'All';
      state.filterSeverity = 'All';
      state.filterAssignee = 'All';
      state.filterCompletedDate = 'All';
      state.sortField = 'createdAt';
      state.sortOrder = 'desc';
    },
  },
});

export const {
  setSearchTerm,
  setFilterStatus,
  setFilterPriority,
  setFilterSeverity,
  setFilterAssignee,
  setFilterCompletedDate,
  setSortField,
  setSortOrder,
  toggleSortOrder,
  resetFilters,
} = issuesFilterSlice.actions;

export default issuesFilterSlice.reducer;
