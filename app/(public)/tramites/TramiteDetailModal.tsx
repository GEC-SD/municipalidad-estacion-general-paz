'use client';

import dynamic from 'next/dynamic';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Tramite } from '@/types';
import { sanitizeHtml } from '@/utils/sanitize';

const PdfViewerModal = dynamic(
  () => import('../transparencia/PdfViewerModal'),
  { ssr: false }
);

type TramiteDetailModalProps = {
  tramite: Tramite | null;
  open: boolean;
  onClose: () => void;
};

const TramiteDetailModal = ({ tramite, open, onClose }: TramiteDetailModalProps) => {
  if (!tramite) return null;

  // Si es PDF, reusar el PdfViewerModal de transparencia
  if (tramite.content_type === 'pdf' && tramite.pdf_url) {
    return (
      <PdfViewerModal
        open={open}
        onClose={onClose}
        pdfUrl={tramite.pdf_url}
        title={tramite.title}
        regulationNumber=""
      />
    );
  }

  // Si es texto enriquecido
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '92vh' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, pr: 2 }}>
          {tramite.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {tramite.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tramite.description}
          </Typography>
        )}
        <Box
          sx={{
            '& h1': { fontSize: '1.5rem', fontWeight: 700, mb: 1 },
            '& h2': { fontSize: '1.25rem', fontWeight: 600, mb: 1 },
            '& h3': { fontSize: '1.1rem', fontWeight: 600, mb: 1 },
            '& p': { mb: 1, lineHeight: 1.7 },
            '& ul, & ol': { pl: 3, mb: 2 },
            '& li': { mb: 0.5 },
            '& a': { color: 'primary.main' },
          }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(tramite.rich_content || ''),
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TramiteDetailModal;
