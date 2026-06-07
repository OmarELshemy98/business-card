'use client';

import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton, Link as MuiLink, Button, TextField, Snackbar, Alert } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { Profile } from '../../types/profile';
import { supabase } from '../../../../supabaseClient';

type CardClientProps = {
  profile: Profile | null;
};

export default function CardClient({ profile }: CardClientProps) {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; sev: 'success' | 'error' }>({
    open: false,
    msg: '',
    sev: 'success'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  if (!profile) return <div className="p-8"><Typography>Card not found</Typography></div>;

  const cardUrl = typeof window !== 'undefined' ? window.location.href : '';
  const bgColor = profile.background_color || '#0f172a';
  const textColor = profile.text_color || '#ffffff';

  const generateVCard = () => {
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:;${profile.name};;;`,
      `FN:${profile.name}`,
      profile.title && `TITLE:${profile.title}`,
      profile.company_name && `ORG:${profile.company_name}`,
      profile.phone1 && `TEL;TYPE=CELL:${profile.phone1}`,
      profile.phone2 && `TEL;TYPE=WORK:${profile.phone2}`,
      profile.email && `EMAIL:${profile.email}`,
      profile.website && `URL:${profile.website}`,
      profile.description && `NOTE:${profile.description}`,
      'END:VCARD'
    ].filter(Boolean).join('\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name || 'contact'}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Insert lead into database
      await supabase.from('leads').insert({
        profileId: profile.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      
      setSnackbar({ open: true, msg: 'Thank you! Your message has been sent.', sev: 'success' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending lead:', error);
      setSnackbar({ open: true, msg: 'Something went wrong. Please try again.', sev: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: bgColor, 
        color: textColor, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        py: 4,
        px: 2
      }}
    >
      {profile.cover_image && (
        <Box 
          sx={{ 
            width: '100%', 
            maxWidth: 400, 
            height: 160, 
            borderRadius: 2, 
            mb: -8, 
            overflow: 'hidden' 
          }}
        >
          <img 
            src={profile.cover_image} 
            alt="Cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </Box>
      )}
      
      <Box sx={{ textAlign: 'center', mt: profile.cover_image ? 4 : 0, maxWidth: 400, width: '100%' }}>
        {profile.profile_image ? (
          <Avatar 
            src={profile.profile_image} 
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: `4px solid ${bgColor}` }} 
          />
        ) : (
          <Avatar 
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, fontSize: '3rem', backgroundColor: 'primary.main' }} 
          >
            {profile.name?.charAt(0)}
          </Avatar>
        )}
        
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{profile.name}</Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>{profile.title}</Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>{profile.company_name}</Typography>
        
        {profile.description && (
          <Typography variant="body1" sx={{ mb: 3 }}>
            {profile.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4, maxWidth: 300, mx: 'auto' }}>
          {profile.phone1 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
              <PhoneIcon />
              <MuiLink href={`tel:${profile.phone1}`} sx={{ color: textColor, textDecoration: 'none' }}>
                {profile.phone1}
              </MuiLink>
            </Box>
          )}
          
          {profile.phone2 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
              <PhoneIcon />
              <MuiLink href={`tel:${profile.phone2}`} sx={{ color: textColor, textDecoration: 'none' }}>
                {profile.phone2}
              </MuiLink>
            </Box>
          )}
          
          {profile.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
              <EmailIcon />
              <MuiLink href={`mailto:${profile.email}`} sx={{ color: textColor, textDecoration: 'none' }}>
                {profile.email}
              </MuiLink>
            </Box>
          )}
          
          {profile.website && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 2 }}>
              <LanguageIcon />
              <MuiLink href={profile.website} target="_blank" sx={{ color: textColor, textDecoration: 'none' }}>
                {profile.website}
              </MuiLink>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 4 }}>
          {profile.facebook && (
            <IconButton 
              href={profile.facebook} 
              target="_blank" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
            >
              <FacebookIcon />
            </IconButton>
          )}
          {profile.instagram && (
            <IconButton 
              href={profile.instagram} 
              target="_blank" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
            >
              <InstagramIcon />
            </IconButton>
          )}
          {profile.twitter && (
            <IconButton 
              href={profile.twitter} 
              target="_blank" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
            >
              <TwitterIcon />
            </IconButton>
          )}
          {profile.linkedin && (
            <IconButton 
              href={profile.linkedin} 
              target="_blank" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
            >
              <LinkedInIcon />
            </IconButton>
          )}
          {profile.youtube && (
            <IconButton 
              href={profile.youtube} 
              target="_blank" 
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: textColor }}
            >
              <YouTubeIcon />
            </IconButton>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2, display: 'inline-block' }}>
            <QRCodeSVG value={cardUrl} size={150} />
          </Box>
          
          <Button 
            variant="contained" 
            startIcon={<DownloadIcon />}
            onClick={generateVCard}
            sx={{ 
              backgroundColor: textColor === '#ffffff' || !textColor ? '#fff' : '#0f172a', 
              color: textColor === '#ffffff' || !textColor ? '#0f172a' : '#fff'
            }}
          >
            Download vCard
          </Button>
        </Box>

        {/* Lead Collection Form */}
        <Box sx={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          borderRadius: 2, 
          p: 3, 
          maxWidth: 350, 
          mx: 'auto',
          width: '100%'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Get in Touch</Typography>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <TextField 
              label="Your Name" 
              variant="outlined"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: textColor }
                },
                '& .MuiInputLabel-root': { color: textColor },
                '& .MuiOutlinedInput-input': { color: textColor }
              }}
            />
            <TextField 
              label="Your Email" 
              variant="outlined"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: textColor }
                },
                '& .MuiInputLabel-root': { color: textColor },
                '& .MuiOutlinedInput-input': { color: textColor }
              }}
            />
            <TextField 
              label="Your Phone" 
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: textColor }
                },
                '& .MuiInputLabel-root': { color: textColor },
                '& .MuiOutlinedInput-input': { color: textColor }
              }}
            />
            <TextField 
              label="Message" 
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: textColor }
                },
                '& .MuiInputLabel-root': { color: textColor },
                '& .MuiOutlinedInput-input': { color: textColor }
              }}
            />
            <Button 
              type="submit" 
              variant="contained"
              disabled={loading}
              startIcon={<SendIcon />}
              sx={{ 
                backgroundColor: textColor === '#ffffff' || !textColor ? '#fff' : '#0f172a', 
                color: textColor === '#ffffff' || !textColor ? '#0f172a' : '#fff'
              }}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.sev} sx={{ width: '100%' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
