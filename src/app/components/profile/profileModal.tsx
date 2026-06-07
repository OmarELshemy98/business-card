'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  IconButton, Box, Snackbar, Alert, Typography, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QRCodeSVG } from 'qrcode.react';

import { Profile } from '../../types/profile';
import ProfileForm, { ProfileFormValues } from './ProfileForm';
import { createProfile, updateProfile, uploadImage } from '../../lib/services/profilesService';
import { useAuth } from '../../hooks/useAuth';

const companyOptions = [
  { value: 'medyour', label: 'medyour' },
  { value: 'axiom', label: 'axiom' },
  { value: 'arcon', label: 'arcon' },
  { value: 'customTemplate', label: 'custom Template' },
] as const;

export default function ProfileModal({ open, handleClose, profile, mode, onDataChanged }: {
  open: boolean;
  handleClose: () => void;
  profile?: Profile | null;
  mode: 'add' | 'edit' | 'view';
  onDataChanged: () => Promise<void>;
}) {
  const isAdd = mode === 'add';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false, msg: '', sev: 'success'
  });
  const showSnack = (msg: string, sev: 'success' | 'error' = 'success') =>
    setSnackbar({ open: true, msg, sev });

  // Zod Schema
  const schema = useMemo(() => {
    return z.object({
      id: z.string().optional(),
      name: z.string().min(1, 'Name is required'),
      title: z.string().optional().or(z.literal('')),
      companyName: z.string().optional().or(z.literal('')),
      phone1: z.string().optional().or(z.literal('')),
      phone2: z.string().optional().or(z.literal('')),
      customerId: z.string().min(1, 'Template is required'),
      email: z.string().email('Invalid email').optional().or(z.literal('')),
      website: z.string().url('Invalid URL').optional().or(z.literal('')),
      linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
      instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
      youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
      tiktok: z.string().url('Invalid URL').optional().or(z.literal('')),
      description: z.string().optional().or(z.literal('')),
      profileImage: z.string().optional().or(z.literal('')),
      coverImage: z.string().optional().or(z.literal('')),
      backgroundColor: z.string().optional().or(z.literal('')),
      textColor: z.string().optional().or(z.literal('')),
      slug: z.string().optional().or(z.literal('')),
    });
  }, []);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      id: (profile as any)?.id ?? '',
      name: profile?.name ?? '',
      title: profile?.title ?? '',
      companyName: profile?.companyName ?? '',
      phone1: profile?.phone1 ?? '',
      phone2: profile?.phone2 ?? '',
      customerId: profile?.customerId ?? '',
      email: profile?.email ?? '',
      website: profile?.website ?? '',
      linkedin: profile?.linkedin ?? '',
      twitter: profile?.twitter ?? '',
      facebook: profile?.facebook ?? '',
      instagram: profile?.instagram ?? '',
      youtube: profile?.youtube ?? '',
      tiktok: profile?.tiktok ?? '',
      description: profile?.description ?? '',
      profileImage: profile?.profileImage ?? '',
      coverImage: profile?.coverImage ?? '',
      backgroundColor: profile?.backgroundColor ?? '#0f172a',
      textColor: profile?.textColor ?? '#ffffff',
      slug: profile?.slug ?? '',
    },
  });

  useEffect(() => {
    methods.reset({
      id: (profile as any)?.id ?? '',
      name: profile?.name ?? '',
      title: profile?.title ?? '',
      companyName: profile?.companyName ?? '',
      phone1: profile?.phone1 ?? '',
      phone2: profile?.phone2 ?? '',
      customerId: profile?.customerId ?? '',
      email: profile?.email ?? '',
      website: profile?.website ?? '',
      linkedin: profile?.linkedin ?? '',
      twitter: profile?.twitter ?? '',
      facebook: profile?.facebook ?? '',
      instagram: profile?.instagram ?? '',
      youtube: profile?.youtube ?? '',
      tiktok: profile?.tiktok ?? '',
      description: profile?.description ?? '',
      profileImage: profile?.profileImage ?? '',
      coverImage: profile?.coverImage ?? '',
      backgroundColor: profile?.backgroundColor ?? '#0f172a',
      textColor: profile?.textColor ?? '#ffffff',
      slug: profile?.slug ?? '',
    });
  }, [profile, methods]);

  const handleImageUpload = async (file: File, field: 'profileImage' | 'coverImage') => {
    try {
      const url = await uploadImage(file);
      methods.setValue(field, url);
      showSnack('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error(error);
      showSnack('Failed to upload image. Please try again.', 'error');
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (isAdd) {
        if (!user?.id) throw new Error('User not logged in');
        await createProfile({
          ...values,
          ownerId: user.id,
        });
        showSnack('Profile added successfully!', 'success');
      } else if (isEdit) {
        const docId = (profile as any)?.id || values.id;
        if (!docId) {
          showSnack('Error: Profile ID is missing.', 'error');
          return;
        }
        await updateProfile(docId, values);
        showSnack('Profile updated successfully!', 'success');
      }
      await onDataChanged();
      handleClose();
    } catch (error) {
      console.error(error);
      showSnack('Failed to save profile. Please try again.', 'error');
    }
  };

  const titleText = isAdd
    ? 'Add New Business Card'
    : isEdit
      ? `Edit Card: ${methods.watch('name') || ''}`
      : `View Card: ${methods.watch('name') || ''}`;

  // Live preview values
  const previewData = methods.watch();
  const bgColor = previewData.backgroundColor || '#0f172a';
  const textColor = previewData.textColor || '#ffffff';

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      sx={{ '& .MuiDialog-paper': { margin: { xs: 0, sm: '32px' }, height: { xs: '100vh', sm: '90vh' }, maxHeight: { xs: '100vh', sm: '90vh' } } }}
    >
      <DialogTitle
        sx={{ m: 0, p: { xs: 2, sm: 2 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
      >
        <Box sx={{ flex: 1, pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {titleText}
        </Box>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: (t: any) => t.palette.grey[500], flexShrink: 0 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, maxHeight: { xs: 'calc(100vh - 140px)', sm: 'calc(90vh - 140px)' }, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Form */}
          <Box sx={{ flex: 1 }}>
            <FormProvider {...methods}>
              <ProfileForm mode={mode} companyOptions={companyOptions} onImageUpload={handleImageUpload} />
            </FormProvider>
          </Box>

          {/* Live Preview */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mb: 2 }}>
              Live Preview
            </Typography>
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: 3,
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: bgColor,
                color: textColor,
              }}
            >
              {previewData.coverImage && (
                <Box sx={{ width: '100%', maxWidth: 300, height: 100, borderRadius: 1, mb: -4, overflow: 'hidden' }}>
                  <img src={previewData.coverImage} alt="Preview Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              )}
              
              <Box sx={{ textAlign: 'center', mt: previewData.coverImage ? 2 : 0 }}>
                {previewData.profileImage ? (
                  <Avatar
                    src={previewData.profileImage}
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 1, border: `4px solid ${bgColor}` }}
                  />
                ) : (
                  <Avatar
                    sx={{ width: 80, height: 80, mx: 'auto', mb: 1, fontSize: '2rem', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    {previewData.name?.charAt(0) || '?'}
                  </Avatar>
                )}
                
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {previewData.name || 'Your Name'}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  {previewData.title || 'Job Title'}
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {previewData.companyName || 'Company Name'}
                </Typography>

                {previewData.description && (
                  <Typography variant="body2" sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
                    {previewData.description}
                  </Typography>
                )}

                <Box sx={{ maxWidth: 250, mx: 'auto', width: '100%' }}>
                  <QRCodeSVG value="https://example.com" size={120} fgColor={textColor} bgColor="transparent" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end', gap: 1, p: { xs: 2, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' }, '& > *': { width: { xs: '100%', sm: 'auto' } } }}>
        {isView ? (
          <Button onClick={handleClose} color="primary" variant="outlined" size="large">Close</Button>
        ) : (
          <>
            <Button onClick={handleClose} color="primary" variant="outlined" size="large">Cancel</Button>
            <Button
              onClick={methods.handleSubmit(onSubmit)}
              color="primary"
              variant="contained"
              size="large"
              disabled={methods.formState.isSubmitting}
            >
              {isAdd ? 'Save Card' : 'Save Changes'}
            </Button>
          </>
        )}
      </DialogActions>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.sev} sx={{ width: '100%' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
