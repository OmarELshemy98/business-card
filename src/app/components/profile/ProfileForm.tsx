'use client';

import React from 'react';
import {
  Box, Divider, Typography, TextField, MenuItem,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type Mode = 'add' | 'edit' | 'view';

export type ProfileFormValues = {
  id?: string;
  name: string;
  title?: string;
  customerId: string;
  email?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  description?: string;
};

type Option = { value: string; label: string };

type Props = {
  mode: Mode;
  companyOptions: Readonly<Option[]>;
};

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

export default function ProfileForm({ mode, companyOptions }: Props) {
  const isView = mode === 'view';
  const isAdd = mode === 'add';

  return (
    <>
      {/* Customer Information */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Customer Information
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <RHFTextField name="name" label="Name" required disabled={isView} />
          <RHFTextField name="title" label="Job Title" disabled={isView} />
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
            <RHFTextField name="customerId" label="Company Name" disabled />
          )}
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
