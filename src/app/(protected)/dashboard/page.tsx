'use client';

import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #F0F2F5 0%, #e3e9f7 100%)'
            : 'linear-gradient(135deg, #1A202C 0%, #232946 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          letterSpacing: 1,
          color: (theme) => theme.palette.primary.main,
          mb: 3,
        }}
      >
        Dashboard
      </Typography>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          minWidth: { xs: '90vw', sm: 400 },
          maxWidth: 500,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? '#fff'
              : theme.palette.background.paper,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <HourglassEmptyIcon
            color="primary"
            sx={{ fontSize: 60, mb: 1, opacity: 0.7 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: (theme) =>
                theme.palette.mode === 'light'
                  ? 'text.secondary'
                  : 'text.primary',
              textAlign: 'center',
            }}
          >
            Coming Soon!
          </Typography>
          <Divider flexItem sx={{ my: 1, width: '60%' }} />
          <Typography
            variant="body2"
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light'
                  ? 'text.secondary'
                  : 'grey.400',
              textAlign: 'center',
              maxWidth: 350,
            }}
          >
            The dashboard is under construction. Exciting features and insights will be available here soon. Stay tuned!
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
