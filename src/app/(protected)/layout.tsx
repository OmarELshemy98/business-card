'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Box, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';

import AuthGuard from '../../auth/AuthGuard';     // (protected) -> ../auth
import { useAuth } from '../hooks/useAuth';    // (protected) -> ../hooks

const drawerWidth = 240;

type NavItem = { label: string; href: string; icon: React.ReactNode; exact?: boolean };

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon />, exact: true },
  { label: 'Business Cards', href: '/business-cards', icon: <CreditCardIcon /> },
  { label: 'Users', href: '/users', icon: <PeopleIcon /> }, // ⬅️ جديد
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const toggleDrawer = () => setMobileOpen(v => !v);

  const DrawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap>Business Cards</Typography>
        <Typography variant="caption" color="text.secondary">v1.0</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => {
          const selected = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                onClick={() => setMobileOpen(false)}
                sx={{
                  '&.Mui-selected': { bgcolor: 'action.selected' },
                  '&.Mui-selected:hover': { bgcolor: 'action.selected' },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={async () => { await signOut(); router.push('/login'); }}
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex' }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          sx={{
            zIndex: (t) => t.zIndex.drawer + 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { md: 'none' } }}
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flex: 1 }}>
              {navItems.find(n => (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.label || 'Dashboard'}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Drawer Area */}
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="sidemenu">
          {/* Mobile (temporary) */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: drawerWidth }
            }}
          >
            {DrawerContent}
          </Drawer>
          {/* Desktop (permanent) */}
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
            }}
          >
            {DrawerContent}
          </Drawer>
        </Box>

        {/* Page content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 2, width: { md: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar /> {/* spacer for the AppBar height */}
          {children}
        </Box>
      </Box>
    </AuthGuard>
  );
}
