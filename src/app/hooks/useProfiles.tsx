// src/app/hooks/useProfiles.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { GridSortModel, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { GridActionsCellItem } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { Profile } from '../types/profile';
import { useAuth } from './useAuth';
import { fetchProfilesForUser, deleteProfileFromDB } from '../lib/services/profilesService';

export function useProfiles() {
  // --- auth ---
  const { user } = useAuth();

  // --- state ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  // --- default sort model ---
  const sortModel: GridSortModel = useMemo(() => [{ field: 'customerId', sort: 'asc' }], []);

  // --- integration calls ---
  const fetchProfiles = async () => {
    // لو مفيش يوزر (لسه بيلود مثلًا) فضي الليست ووقف اللودينج
    if (!user) {
      setProfiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchProfilesForUser(user.id);
      setProfiles(data);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // كل ما الـ uid يتغير (login/logout) أعد الجلب

  // --- delete flow ---
  const handleDeleteClick = (id: string) => {
    setProfileToDelete(id);
    setOpenConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (profileToDelete) {
      try {
        await deleteProfileFromDB(profileToDelete);
        await fetchProfiles();
      } catch (error) {
        console.error('Failed to delete profile:', error);
      } finally {
        setOpenConfirmDelete(false);
        setProfileToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenConfirmDelete(false);
    setProfileToDelete(null);
  };

  // --- search ---
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // --- modals ---
  const handleOpenAddModal = () => {
    setSelectedProfile(null);
    setIsEditing(false);
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenViewModal = (profile: Profile, editing: boolean) => {
    setSelectedProfile(profile);
    setIsEditing(editing);
    setOpenViewModal(true);
  };
  const handleCloseViewModal = () => {
    setSelectedProfile(null);
    setOpenViewModal(false);
  };

  // --- filtered rows ---
  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    const q = (searchTerm || '').toLowerCase();

    return profiles.filter((p: Profile) => {
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.customerId || '').toLowerCase().includes(q) ||
        (p.companyName || '').toLowerCase().includes(q)
      );
    });
  }, [profiles, searchTerm]);

  // --- view public card ---
  const handleViewPublicCard = (id: string) => {
    window.open(`/card/${id}`, '_blank');
  };

  // --- columns (responsive friendly) ---
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Full Name',
        minWidth: 150,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        hideable: false,
      },
      {
        field: 'title',
        headerName: 'Job Title',
        minWidth: 120,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        hideable: true,
      },
      {
        field: 'customerId',
        headerName: 'Template',
        minWidth: 120,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        hideable: true,
      },
      {
        field: 'id',
        headerName: 'ID',
        minWidth: 120,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        hideable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        minWidth: 140,
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        hideable: false,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="public"
            icon={<OpenInNewIcon fontSize="small" />}
            label="View Public Card"
            onClick={() => handleViewPublicCard((params.row as Profile).id)}
          />,
          <GridActionsCellItem
            key="view"
            icon={<VisibilityIcon fontSize="small" />}
            label="View"
            onClick={() => handleOpenViewModal(params.row as Profile, false)}
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon fontSize="small" />}
            label="Edit"
            onClick={() => handleOpenViewModal(params.row as Profile, true)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon color="error" fontSize="small" />}
            label="Delete"
            onClick={() => handleDeleteClick((params.row as Profile).id)}
          />,
        ],
      },
    ],
    [] // مفيش dependencies علشان ما يعادشي بناء الأعمدة كل ريندر
  );

  return {
    // state & derived
    loading,
    searchTerm,
    filteredProfiles,
    columns,
    sortModel,

    // modals state
    openAddModal,
    openViewModal,
    selectedProfile,
    isEditing,

    // delete dialog state
    openConfirmDelete,

    // handlers
    handleSearchChange,
    handleOpenAddModal,
    handleCloseAddModal,
    handleOpenViewModal,
    handleCloseViewModal,
    handleCancelDelete,
    handleConfirmDelete,

    // integration
    fetchProfiles,
  };
}
