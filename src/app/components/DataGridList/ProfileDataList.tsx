/**
 * Profiles Data List Component
 * * This component displays the main data grid for business cards with search functionality.
 * It includes the search bar, add button, and handles all modal operations.
 * * Purpose: Main UI component for displaying and managing business card data
 * Dependencies: Material-UI components, CustomDataGrid, ProfileModal
 */

'use client';

import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CustomDataGrid from '../CustomDataGrid';
import ProfileModal from '../profile/profileModal';
import type { GridColDef, GridSortModel, GridRowParams } from '@mui/x-data-grid';
import type { Profile } from '../../types/profile';

type Props = {
  searchTerm: string;
  onSearchChange: (e: any) => void;
  filteredRows: Profile[];
  columns: GridColDef[];
  loading: boolean;
  sortModel: GridSortModel;
  openAddModal: boolean;
  onOpenAdd: () => void;
  onCloseAdd: () => void;
  openViewModal: boolean;
  onCloseView: () => void;
  selectedProfile: Profile | null;
  isEditing: boolean;
  onDataChanged: () => Promise<void>;
  openConfirmDelete: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => Promise<void>;
  onRowClick: (params: GridRowParams) => void;
};

export default function ProfilesDataList({
  searchTerm,
  onSearchChange,
  filteredRows,
  columns,
  loading,
  sortModel,
  openAddModal,
  onOpenAdd,
  onCloseAdd,
  openViewModal,
  onCloseView,
  selectedProfile,
  isEditing,
  onDataChanged,
  openConfirmDelete,
  onCancelDelete,
  onConfirmDelete,
  onRowClick,
}: Props) {
  // Remove the "id" column from the columns array before passing to DataGrid
  const columnsWithoutId = React.useMemo(
    () => columns.filter(col => col.field !== 'id'),
    [columns]
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Title centered at the top */}
      <Box className="mb-4 sm:mb-6">
        <Typography
          variant="h4"
          component="h1"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center"
        >
          Business Cards
        </Typography>
      </Box>

      {/* Search bar with search button, and Add button on the left */}
      <Box className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Add Button on the left */}
        <Box className="w-full sm:w-auto flex justify-center sm:justify-start order-2 sm:order-1">
          <Button
            variant="contained"
            color="primary"
            onClick={onOpenAdd}
            className="!rounded-xl !shadow-md !py-2 sm:!py-3 !px-4 sm:!px-6 !whitespace-nowrap !text-sm sm:!text-base !w-full sm:!w-auto"
          >
            Add Business Card
          </Button>
        </Box>

        {/* Search bar and search button centered */}
        <Box className="flex flex-1 items-center justify-center gap-2 w-full sm:w-auto order-1 sm:order-2">
          <TextField
            fullWidth
            label="Search by Name, Title, or Company..."
            variant="outlined"
            value={searchTerm}
            onChange={onSearchChange}
            className="rounded-xl bg-white shadow-sm"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            className="!rounded-xl !shadow-md !py-2 sm:!py-3 !px-3 sm:!px-6 !min-w-0"
            onClick={() => {}} // No-op, you can add a handler if needed
            aria-label="Search"
          >
            <SearchIcon className="!text-lg sm:!text-xl" />
          </Button>
        </Box>
      </Box>

      {/* The DataGrid section */}
      <Box className="rounded-xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        {/* Conditional rendering to prevent errors if columns are not ready */}
        {columns && filteredRows ? (
          <CustomDataGrid
            rows={filteredRows}
            columns={columnsWithoutId}
            loading={loading}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: sortModel },
            }}
            pageSizeOptions={[5, 10, 20]}
            autoHeight
            onRowClick={onRowClick}
            disableRowSelectionOnClick
            disableColumnMenu={false}
            disableColumnFilter={false}
            disableColumnSelector={false}
            disableDensitySelector={false}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:focus': {
                outline: 'none',
              },
            }}
          />
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1">Loading data...</Typography>
          </Box>
        )}
      </Box>

      {/* Replaced AddCardModal and ViewCardModal with ProfileModal */}
      <ProfileModal
        open={openAddModal}
        handleClose={onCloseAdd}
        mode="add"
        onDataChanged={onDataChanged}
      />

      <ProfileModal
        open={openViewModal}
        handleClose={onCloseView}
        profile={selectedProfile}
        mode={isEditing ? 'edit' : 'view'}
        onDataChanged={onDataChanged}
      />

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openConfirmDelete} onClose={onCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this business card?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelDelete} color="primary">Cancel</Button>
          <Button onClick={() => onConfirmDelete(selectedProfile?.id || '')} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
