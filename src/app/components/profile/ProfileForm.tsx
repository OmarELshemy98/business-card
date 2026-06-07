'use client';

import React, { useState } from 'react';
import {
  Box, Divider, Typography, TextField, MenuItem, Button, InputAdornment, IconButton
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

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
};

type Option = { value: string; label: string };

type SavedTemplate = {
  name: string;
  backgroundColor: string;
  textColor: string;
};

type Props = {
  mode: Mode;
  companyOptions: Readonly<Option[]>;
  onImageUpload: (file: File, field: 'profileImage' | 'coverImage') => Promise<void>;
  onSaveTemplate?: (name: string) => void;
  savedTemplates?: SavedTemplate[];
  onLoadTemplate?: (template: SavedTemplate) => void;
  onDeleteTemplate?: (index: number) => void;
};

// Luxury Themes
const themes = [
  { name: 'Royal Black', backgroundColor: '#000000', textColor: '#D4AF37' },
  { name: 'Midnight Blue', backgroundColor: '#0B132B', textColor: '#6FFFE9' },
  { name: 'Deep Burgundy', backgroundColor: '#4A0E0E', textColor: '#F5E6E8' },
  { name: 'Forest Green', backgroundColor: '#1A3E28', textColor: '#D4F1C2' },
  { name: 'Ocean Teal', backgroundColor: '#0F4C75', textColor: '#BBE1FA' },
  { name: 'Lavender Dream', backgroundColor: '#4B3D60', textColor: '#F3E8FF' },
  { name: 'Charcoal Gold', backgroundColor: '#2C3639', textColor: '#DCD7C9' },
  { name: 'Sapphire White', backgroundColor: '#132743', textColor: '#E4E4E4' },
  { name: 'Rose Gold', backgroundColor: '#5A3D4A', textColor: '#FFD1DC' },
  { name: 'Navy Silver', backgroundColor: '#171F33', textColor: '#C0C0C0' },
  { name: 'Ivory Black', backgroundColor: '#F5F5F5', textColor: '#1A1A1A' },
  { name: 'Classic Cream', backgroundColor: '#F8F5E4', textColor: '#4A4A4A' },
  { name: 'Modern Gray', backgroundColor: '#2A2A2A', textColor: '#E8E8E8' },
  { name: 'Warm Tan', backgroundColor: '#5C4D3E', textColor: '#FFF3E0' },
  { name: 'Purple Haze', backgroundColor: '#3F2345', textColor: '#E8D5F3' },
  { name: 'Coral Deep', backgroundColor: '#5C1A1A', textColor: '#FFE4E1' },
];

const RHFTextField = ({
  name, label, disabled, type, select, required, options, multiline, minRows, maxRows, maxLength,
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
  maxRows?: number;
  maxLength?: number;
}) => {
  const { control, formState: { errors }, watch } = useFormContext<ProfileFormValues>();
  const value = watch(name);
  
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
          maxRows={maxRows}
          inputProps={maxLength ? { maxLength } : undefined}
          InputProps={maxLength && multiline ? {
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: 'flex-end', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  {value?.length || 0}/{maxLength}
                </Typography>
              </InputAdornment>
            ),
          } : undefined}
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

export default function ProfileForm({ mode, companyOptions, onImageUpload, onSaveTemplate, savedTemplates, onLoadTemplate, onDeleteTemplate }: Props) {
  const isView = mode === 'view';
  const isAdd = mode === 'add';
  const { watch, setValue } = useFormContext<ProfileFormValues>();
  const [templateName, setTemplateName] = useState('');

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

  const handleSaveTemplate = () => {
    if (templateName.trim() && onSaveTemplate) {
      onSaveTemplate(templateName.trim());
      setTemplateName('');
    }
  };

  return (
    <>
      {/* Customization Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, mb: 2 }}>
          Customization
        </Typography>

        {/* Saved Templates */}
        {!isView && savedTemplates && savedTemplates.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Your Saved Templates</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {savedTemplates.map((template, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 0.5 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onLoadTemplate?.(template)}
                    sx={{
                      backgroundColor: 'transparent',
                      borderColor: template.backgroundColor,
                      color: template.backgroundColor,
                      ':hover': {
                        backgroundColor: template.backgroundColor,
                        color: template.textColor,
                      },
                    }}
                  >
                    {template.name}
                  </Button>
                  {onDeleteTemplate && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDeleteTemplate(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Theme Picker */}
        {!isView && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Luxury Quick Themes</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {themes.map((theme, index) => (
                <Button
                  key={index}
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
              ))}
            </Box>
          </Box>
        )}

        {/* Save Template */}
        {!isView && onSaveTemplate && (
          <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'flex-end' }}>
            <TextField
              label="Save Template As"
              size="small"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<SaveIcon />}
              onClick={handleSaveTemplate}
              disabled={!templateName.trim()}
            >
              Save
            </Button>
          </Box>
        )}

        {/* Full Custom Controls */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Full Custom Theme</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <RHFTextField name="backgroundColor" label="Background Color" disabled={isView} type="color" />
            <RHFTextField name="textColor" label="Text Color" disabled={isView} type="color" />
          </Box>
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
          maxRows={6}
          maxLength={500}
        />
      </Box>
    </>
  );
}
