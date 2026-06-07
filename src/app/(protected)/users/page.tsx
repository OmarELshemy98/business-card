'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, TextField, Paper } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from '../../components/CustomDataGrid';
import { fetchUsersFromDB, AppUser } from '../../lib/services/usersService';

export default function UsersPage() {
  const [rows, setRows] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchUsersFromDB();
        setRows(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(u =>
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q)
    );
  }, [rows, search]);

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 220 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 140 },
    { field: 'role', headerName: 'Role', flex: 0.6, minWidth: 100 },
    {
      field: 'created_at',
      headerName: 'Created',
      flex: 0.8,
      minWidth: 130,
      valueGetter: (params: any) => {
        const row = params.row as AppUser;
        const v = row.created_at;
        if (!v) return '';
        const date = new Date(v);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Users</Typography>

      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Search by email, name, role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      <CustomDataGrid
        rows={filtered}
        columns={columns}
        loading={loading}
        autoHeight
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
