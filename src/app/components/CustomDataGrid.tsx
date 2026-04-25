/**
 * Custom DataGrid Component
 * 
 * This component wraps the Material-UI DataGrid with custom styling.
 * It provides a consistent look and feel for data tables throughout the app.
 * 
 * Purpose: Styled wrapper for Material-UI DataGrid with custom theme
 * Dependencies: @mui/x-data-grid
 */

'use client';

import { DataGrid, DataGridProps } from '@mui/x-data-grid';

// Interface definition for component props
type CustomDataGridProps = DataGridProps;

export default function CustomDataGrid(props: CustomDataGridProps) {
  return (
    <DataGrid
      {...props} // Pass all other props like rows, columns, loading, etc.
      className="!bg-white !text-gray-800"
      sx={{
        border: 'none',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#f3f4f6',
          color: '#374151',
          fontWeight: 700,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          borderBottom: '2px solid #e5e7eb',
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
        },
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
          borderBottom: '1px solid #f3f4f6',
          '&:hover': {
            backgroundColor: '#f9fafb',
            transition: 'background-color 0.2s',
          },
        },
        '& .MuiDataGrid-cell': {
          fontSize: { xs: '0.875rem', sm: '0.98rem' },
          padding: { xs: '8px', sm: '12px' },
          '& .MuiDataGrid-cellContent': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: '#f3f4f6',
          borderTop: '1px solid #e5e7eb',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
        },
        '& .MuiDataGrid-selectedRowCount': {
          visibility: 'hidden',
        },
        '& .MuiDataGrid-sortIcon': {
          color: '#374151',
        },
        '& .MuiTablePagination-root': {
          color: '#6b7280',
          fontSize: { xs: '0.875rem', sm: '1rem' },
        },
        '& .MuiTablePagination-selectIcon': {
          color: '#6b7280',
        },
        '& .MuiDataGrid-actionsCell': {
          padding: { xs: '4px', sm: '8px' },
        },
        '& .MuiIconButton-root': {
          padding: { xs: '4px', sm: '8px' },
        },
        // Mobile-specific optimizations
        '& .MuiDataGrid-main': {
          overflowX: 'auto',
        },
        '& .MuiDataGrid-virtualScroller': {
          overflowX: 'auto',
        },
      }}
    />
  );
}
