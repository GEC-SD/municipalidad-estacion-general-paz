'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Skeleton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerModalProps = {
  open: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  regulationNumber?: string;
};

const PdfViewerModal = ({
  open,
  onClose,
  pdfUrl,
  title,
  regulationNumber,
}: PdfViewerModalProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setLoading(false);
    setError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(numPages, p + 1));

  const handleClose = () => {
    setCurrentPage(1);
    setNumPages(0);
    setLoading(true);
    setError(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: 900,
          width: '95vw',
          height: '92vh',
          maxHeight: '92vh',
          m: 1,
          borderRadius: 3,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#FAFBFC',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
          {regulationNumber && (
            <Chip
              label={`N° ${regulationNumber}`}
              size="small"
              color="primary"
              sx={{ fontWeight: 600, flexShrink: 0 }}
            />
          )}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* PDF Content */}
      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 0,
          backgroundColor: '#E8EAED',
          overflow: 'auto',
          // Disable right-click to prevent "Save as"
          userSelect: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, p: 4 }}>
            <Typography color="text.secondary" textAlign="center">
              No se pudo cargar el documento. Verificá que el archivo esté disponible.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 2, px: 1 }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                  <Skeleton variant="rectangular" width={600} height={800} sx={{ maxWidth: '85vw', borderRadius: 1 }} />
                </Box>
              }
            >
              <Page
                pageNumber={currentPage}
                width={Math.min(850, typeof window !== 'undefined' ? window.innerWidth * 0.88 : 850)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <Skeleton variant="rectangular" width={600} height={800} sx={{ maxWidth: '85vw', borderRadius: 1 }} />
                }
              />
            </Document>
          </Box>
        )}
      </DialogContent>

      {/* Footer - Pagination */}
      {numPages > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            px: 3,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#FAFBFC',
            flexShrink: 0,
          }}
        >
          <IconButton onClick={goToPrevPage} disabled={currentPage <= 1} size="small">
            <PrevIcon />
          </IconButton>
          <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 100, textAlign: 'center' }}>
            Página {currentPage} de {numPages}
          </Typography>
          <IconButton onClick={goToNextPage} disabled={currentPage >= numPages} size="small">
            <NextIcon />
          </IconButton>
        </Box>
      )}
    </Dialog>
  );
};

export default PdfViewerModal;
