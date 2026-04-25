'use client';

import ProfilesDataList from '../../components/DataGridList/ProfileDataList'; // لو المجلد مختلف عدّله
import { useProfiles } from '../../hooks/useProfiles';
import { Box } from '@mui/material';
import { useThemeContext } from '../../themeContext';

export default function BusinessCardsPage() {
  const {
    loading,
    filteredProfiles,
    columns,
    sortModel,
    searchTerm,
    handleSearchChange,
    openAddModal,
    handleOpenAddModal,
    handleCloseAddModal,
    openViewModal,
    handleCloseViewModal,
    selectedProfile,
    isEditing,
    handleOpenViewModal,
    openConfirmDelete,
    handleCancelDelete,
    handleConfirmDelete,
    fetchProfiles,
  } = useProfiles();

  const { themeMode } = useThemeContext();

  const handleRowClick = (params: any) => {
    handleOpenViewModal(params.row, false);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', backgroundColor: themeMode === 'light' ? '#F0F2F5' : '#1A202C' }}>
      <ProfilesDataList
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filteredRows={filteredProfiles}
        columns={columns}
        loading={loading}
        sortModel={sortModel}
        openAddModal={openAddModal}
        onOpenAdd={handleOpenAddModal}
        onCloseAdd={handleCloseAddModal}
        openViewModal={openViewModal}
        onCloseView={handleCloseViewModal}
        selectedProfile={selectedProfile}
        isEditing={isEditing}
        onDataChanged={fetchProfiles}
        onRowClick={handleRowClick}
        openConfirmDelete={openConfirmDelete}
        onCancelDelete={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </Box>
  );
}
