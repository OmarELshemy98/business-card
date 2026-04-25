'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  IconButton, Box, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { db, auth } from '../../../../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Profile } from '../../types/profile';
import ProfileForm, { ProfileFormValues } from './ProfileForm';

interface ProfileModalProps {
  open: boolean;
  handleClose: () => void;
  profile?: Profile | null;
  mode: 'add' | 'edit' | 'view';
  onDataChanged: () => Promise<void>;
}

const companyOptions = [
  { value: 'medyour', label: 'medyour' },
  { value: 'axiom', label: 'axiom' },
  { value: 'arcon', label: 'arcon' },
  { value: 'customTemplate', label: 'custom Template' },
] as const;

// ✅ اسم الكولكشن في ثابت واحد
const COLLECTION = 'business_cards' as const;

export default function ProfileModal({ open, handleClose, profile, mode, onDataChanged }: ProfileModalProps) {
  const isAdd = mode === 'add';
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

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
      customerId: z.string().min(1, 'Company Name is required'),
      email: z.string().email('Invalid email').optional(),
      website: z.string().url('Invalid URL').optional().or(z.literal('')),
      linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
      twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
      facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
      instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
      youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
      tiktok: z.string().url('Invalid URL').optional().or(z.literal('')),
      description: z.string().optional().or(z.literal('')),
    });
  }, []);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      id: (profile as any)?.id ?? '',
      name: profile?.name ?? '',
      title: profile?.title ?? '',
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
    },
  });

  useEffect(() => {
    methods.reset({
      id: (profile as any)?.id ?? '',
      name: profile?.name ?? '',
      title: profile?.title ?? '',
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, mode, open]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      if (isAdd) {
        // 👇 إنشاء مستند جديد في business_cards مع ownerId = المستخدم الحالي
        const ref = doc(collection(db, COLLECTION));
        const toSave: any = {
          ...values,
          id: ref.id,
          ownerId: auth.currentUser?.uid ?? null,
        };
        await setDoc(ref, toSave);
        showSnack('Profile added successfully!', 'success');
      } else if (isEdit) {
        const docId = (profile as any)?.id || values.id;
        if (!docId) {
          showSnack('Error: Profile ID is missing.', 'error');
          return;
        }
        const ref = doc(db, COLLECTION, docId);
        const toSave: any = { ...values };
        await setDoc(ref, toSave, { merge: true });
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{ '& .MuiDialog-paper': { margin: { xs: 0, sm: '32px' }, height: { xs: '100vh', sm: 'auto' }, maxHeight: { xs: '100vh', sm: '90vh' } } }}
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

      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, maxHeight: { xs: 'calc(100vh - 140px)', sm: '60vh' }, overflow: 'auto' }}>
        <FormProvider {...methods}>
          <ProfileForm mode={mode} companyOptions={companyOptions} />
        </FormProvider>
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
