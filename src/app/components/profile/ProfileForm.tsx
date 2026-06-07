'use client';

import React from 'react';
import {
  Box, Divider, Typography, TextField, MenuItem, Button, Grid
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import ImageIcon from '@mui/icons-material/Image';

type Mode = 'add' | 'edit' | 'view';

export type ProfileFormValues = {
  id?: string;
  name: string;
  title?: string;
  customerId: string;
  companyName?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  description?: string;
  profileImage?: string;
  coverImage?: string;
  backgroundColor?: string;
  textColor?: string;
  slug?: string;
};

type Option = { value: string; label: string };

type Props = {
  mode: Mode;
  companyOptions: Readonly<Option[]>;
  onImageUpload: (file: File, field: 'profileImage' | 'coverImage') => Promise<void>;
};

// Predefined themes
const themes = [
  { name: 'Modern Dark', backgroundColor: '#0f172a', textColor: '#ffffff' },
  { name: 'Elegant Blue', backgroundColor: '#1e3a8a', textColor: '#ffffff' },
  { name: 'Fresh Green', backgroundColor: '#064e3b', textColor: '#ffffff' },
  { name: 'Warm Orange', backgroundColor: '#7c2d12', textColor: '#ffffff' },
  { name: 'Light Professional', backgroundColor: '#f8fafc', textColor: '#0f172a' },
  { name: 'Soft Pink', backgroundColor: '#fce7f3', textColor: '#831843' },
];

const RHFTextField = ({
  name, label, disabled, type, select, required, options, multiline, minRows,
}: {
  name: keyof ProfileFormValues;
  label: string;
  disabled?: boolean;
  type?: string;
  select?: boolean;
  required?: boolean;
  options?: Readonly<Option[]>;
  multiline?: boolean;
  minRows?: number;
}) => {
  const { control, formState: { errors } } = useFormContext<ProfileFormValues>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          size="small"
          disabled={disabled}
          type={type}
          select={select}
          required={required}
          multiline={multiline}
          minRows={minRows}
          error={!!errors[name]}
          helperText={(errors[name]?.message as string) || ''}
        >
          {select && options?.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default function ProfileForm({ mode, companyOptions, onImageUpload }: Props) {
  const isView = mode === 'view';
  const isAdd = mode === 'add';
  const { watch, setValue } = useFormContext<ProfileFormValues>();

  const profileImage = watch('profileImage');
  const coverImage = watch('coverImage');
  const currentBgColor = watch('backgroundColor');
  const currentTextColor = watch('textColor');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'coverImage') => {
    if (e.target.files && e.target.files[0]) {
      await onImageUpload(e.target.files[0], field);
    }
  };

  const applyTheme = (theme: typeof themes[0]) => {
    setValue('backgroundColor', theme.backgroundColor);
    setValue('textColor', theme.textColor);
  };

  return (
    <>
      {/* Customization Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: 2 }}>
          Customization
        </Typography>

        {/* Theme Picker */}
        {!isView && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Themes</Typography>
            <Grid container spacing={1}>
              {themes.map((theme, index) => (
                <Grid item key={index}>
                  <Button
                    variant={
                      currentBgColor === theme.backgroundColor && currentTextColor === theme.textColor ? 'contained' : 'outlined'
                    }
                    size="small"
                    onClick={() => applyTheme(theme)}
                    sx={{
                      backgroundColor: currentBgColor === theme.backgroundColor && currentTextColor === theme.textColor ? theme.backgroundColor : 'transparent',
                      borderColor: theme.backgroundColor,
                      color: currentBgColor === theme.backgroundColor && currentTextColor === theme.textColor ? theme.textColor : theme.backgroundColor,
                      ':hover': {
                        backgroundColor: theme.backgroundColor,
                        color: theme.textColor,
                      },
                    }}
                  >
                    {theme.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Color Pickers */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <RHFTextField name="backgroundColor" label="Background Color" disabled={isView} type="color" />
          <RHFTextField name="textColor" label="Text Color" disabled={isView} type="color" />
        </Box>

        {/* Images */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Profile Image</Typography>
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile"
                style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }}
              />
            )}
            {!isView && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
              >
                Upload Profile Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profileImage')}
                />
              </Button>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Cover Image</Typography>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
              />
            )}
            {!isView && (
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
              >
                Upload Cover Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'coverImage')}
                />
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Customer Information */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Information
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <RHFTextField name="name" label="Name" required disabled={isView} />
          <RHFTextField name="title" label="Job Title" disabled={isView} />
          <RHFTextField name="companyName" label="Company Name" disabled={isView} />
          <RHFTextField name="slug" label="Custom Slug" disabled={isView} placeholder="your-custom-slug" />
          {isAdd ? (
            <RHFTextField
              name="customerId"
              label="Template"
              select
              options={companyOptions}
              required
              disabled={isView}
            />
          ) : (
            <RHFTextField name="customerId" label="Template" disabled />
          )}
          <RHFTextField name="phone1" label="Phone 1" disabled={isView} />
          <RHFTextField name="phone2" label="Phone 2" disabled={isView} />
          <RHFTextField name="email" label="Email" type="email" disabled={isView} />
          <RHFTextField name="website" label="Website" disabled={isView} />
        </div>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Social Media */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Social Media
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <RHFTextField name="linkedin"  label="LinkedIn"  disabled={isView} />
          <RHFTextField name="twitter"   label="Twitter"   disabled={isView} />
          <RHFTextField name="facebook"  label="Facebook"  disabled={isView} />
          <RHFTextField name="instagram" label="Instagram" disabled={isView} />
          <RHFTextField name="youtube"   label="YouTube"   disabled={isView} />
          <RHFTextField name="tiktok"    label="TikTok"    disabled={isView} />
        </div>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Description */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Description
        </Typography>
        <RHFTextField
          name="description"
          label="Short Description About Your Company"
          disabled={isView}
          multiline
          minRows={3}
        />
      </Box>
    </>
  );
}
