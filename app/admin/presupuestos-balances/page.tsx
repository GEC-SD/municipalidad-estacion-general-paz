'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Save as SaveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { supabase } from '@/state/supabase/config';
import { ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS, STORAGE_BUCKETS } from '@/constants';
import type { FinancialDocument, FinancialDocumentType } from '@/types';
import FileUpload from '../components/FileUpload';

const DATE_FORMATTER = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const storagePathFromPublicUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const marker = `/storage/v1/object/public/${STORAGE_BUCKETS.FINANCIAL_DOCUMENTS}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) return null;
    return decodeURIComponent(parsedUrl.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
};

const removeStoredFiles = async (urls: string[]) => {
  const paths = urls
    .map(storagePathFromPublicUrl)
    .filter((path): path is string => Boolean(path));

  if (paths.length === 0) return null;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.FINANCIAL_DOCUMENTS)
    .remove(paths);

  return error;
};

export default function FinancialDocumentsAdminPage() {
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    severity: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | FinancialDocumentType>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<FinancialDocument | null>(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<FinancialDocumentType>('presupuesto');
  const [pdfUrls, setPdfUrls] = useState<string[]>(['']);
  const [saving, setSaving] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<FinancialDocument | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadDocuments = useCallback(async () => {
    const { data, error } = await supabase
      .from('financial_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setMessage({ severity: 'error', text: 'No se pudieron cargar los documentos.' });
    } else {
      setDocuments((data ?? []) as FinancialDocument[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    supabase
      .from('financial_documents')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setMessage({ severity: 'error', text: 'No se pudieron cargar los documentos.' });
        } else {
          setDocuments((data ?? []) as FinancialDocument[]);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es-AR');

    return documents.filter((document) => {
      const matchesSearch = document.title
        .toLocaleLowerCase('es-AR')
        .includes(normalizedSearch);
      const matchesType = typeFilter === 'all' || document.document_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [documents, search, typeFilter]);

  const visibleDocuments = useMemo(
    () => filteredDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredDocuments, page, rowsPerPage]
  );

  const resetForm = () => {
    setEditingDocument(null);
    setTitle('');
    setDocumentType('presupuesto');
    setPdfUrls(['']);
  };

  const openCreateDialog = () => {
    resetForm();
    setMessage(null);
    setFormOpen(true);
  };

  const openEditDialog = (document: FinancialDocument) => {
    setEditingDocument(document);
    setTitle(document.title);
    setDocumentType(document.document_type);
    setPdfUrls(document.pdf_urls.length > 0 ? document.pdf_urls : ['']);
    setMessage(null);
    setAnchorEl(null);
    setFormOpen(true);
  };

  const closeFormDialog = () => {
    if (saving) return;
    setFormOpen(false);
    resetForm();
  };

  const setPdf = (index: number, value?: string) => {
    setPdfUrls((current) => current.map((url, currentIndex) => (
      currentIndex === index ? value ?? '' : url
    )));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const files = pdfUrls.filter(Boolean);

    if (!title.trim() || files.length === 0) {
      setMessage({ severity: 'error', text: 'Ingresá un título y al menos un PDF.' });
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      document_type: documentType,
      pdf_urls: files,
    };

    const { error } = editingDocument
      ? await supabase
          .from('financial_documents')
          .update(payload)
          .eq('id', editingDocument.id)
      : await supabase.from('financial_documents').insert(payload);

    if (error) {
      setMessage({
        severity: 'error',
        text: editingDocument
          ? 'No se pudo actualizar la publicación.'
          : 'No se pudo guardar la publicación.',
      });
      setSaving(false);
      return;
    }

    const removedUrls = editingDocument
      ? editingDocument.pdf_urls.filter((url) => !files.includes(url))
      : [];
    const storageError = await removeStoredFiles(removedUrls);

    setMessage({
      severity: storageError ? 'warning' : 'success',
      text: storageError
        ? 'La publicación se actualizó, pero no se pudieron limpiar algunos PDFs reemplazados.'
        : editingDocument
          ? 'Publicación actualizada correctamente.'
          : 'Publicación guardada correctamente.',
    });
    setFormOpen(false);
    resetForm();
    setPage(0);
    setLoading(true);
    await loadDocuments();
    setSaving(false);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    document: FinancialDocument
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setAnchorEl(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDocument) return;

    setDeleteLoading(true);
    const documentToDelete = selectedDocument;
    const { error } = await supabase
      .from('financial_documents')
      .delete()
      .eq('id', documentToDelete.id);

    if (error) {
      setMessage({ severity: 'error', text: 'No se pudo eliminar la publicación.' });
      setDeleteLoading(false);
      return;
    }

    const storageError = await removeStoredFiles(documentToDelete.pdf_urls);
    setMessage({
      severity: storageError ? 'warning' : 'success',
      text: storageError
        ? 'La publicación se eliminó, pero no se pudieron borrar algunos archivos del almacenamiento.'
        : 'Publicación eliminada correctamente.',
    });
    setDeleteDialogOpen(false);
    setSelectedDocument(null);
    setPage(0);
    setLoading(true);
    await loadDocuments();
    setDeleteLoading(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Presupuestos y Balances
          </Typography>
          <Typography color="text.secondary">
            Administrá publicaciones con uno o varios archivos PDF.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ alignSelf: { xs: 'stretch', sm: 'center' }, whiteSpace: 'nowrap' }}
        >
          Nueva publicación
        </Button>
      </Box>

      {message && (
        <Alert severity={message.severity} onClose={() => setMessage(null)} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 2fr) minmax(190px, 1fr)' },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          size="small"
          label="Buscar por título"
          placeholder="Ej.: Presupuesto 2026"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small">
          <InputLabel>Categoría</InputLabel>
          <Select
            value={typeFilter}
            label="Categoría"
            onChange={(event) => {
              setTypeFilter(event.target.value as 'all' | FinancialDocumentType);
              setPage(0);
            }}
          >
            <MenuItem value="all">Todas las categorías</MenuItem>
            <MenuItem value="presupuesto">Presupuesto</MenuItem>
            <MenuItem value="balance">Balance</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Archivos PDF</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actualizado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton width={100} /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton width={120} /></TableCell>
                    <TableCell><Skeleton width={90} /></TableCell>
                    <TableCell align="right"><Skeleton width={32} sx={{ ml: 'auto' }} /></TableCell>
                  </TableRow>
                ))
              ) : visibleDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 7 }}>
                    <PdfIcon sx={{ fontSize: 42, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                      No se encontraron publicaciones
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Ajustá el título o la categoría seleccionada.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleDocuments.map((document) => (
                  <TableRow key={document.id} hover>
                    <TableCell>
                      <Chip
                        size="small"
                        label={document.document_type === 'presupuesto' ? 'Presupuesto' : 'Balance'}
                        color={document.document_type === 'presupuesto' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {document.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          size="small"
                          icon={<PdfIcon />}
                          label={`${document.pdf_urls.length} ${document.pdf_urls.length === 1 ? 'PDF' : 'PDFs'}`}
                        />
                        {document.pdf_urls.map((url, index) => (
                          <Tooltip key={url} title={`Visualizar PDF ${index + 1}`}>
                            <IconButton
                              component="a"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              color="error"
                              aria-label={`Visualizar PDF ${index + 1} de ${document.title}`}
                            >
                              <PdfIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {DATE_FORMATTER.format(new Date(document.updated_at))}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) => handleMenuOpen(event, document)}
                        aria-label={`Acciones para ${document.title}`}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDocuments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => selectedDocument && openEditDialog(selectedDocument)}
          disabled={!selectedDocument}
        >
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} disabled={!selectedDocument} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog
        open={formOpen}
        onClose={closeFormDialog}
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown={saving}
      >
        <Box component="form" onSubmit={submit}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingDocument ? 'Editar publicación' : 'Nueva publicación'}
          </DialogTitle>
          <DialogContent dividers>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 2fr) minmax(180px, 1fr)' },
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Título"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
                disabled={saving}
              />
              <TextField
                select
                label="Categoría"
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value as FinancialDocumentType)}
                disabled={saving}
              >
                <MenuItem value="presupuesto">Presupuesto</MenuItem>
                <MenuItem value="balance">Balance</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {pdfUrls.map((url, index) => (
                <FileUpload
                  key={`${editingDocument?.id ?? 'new'}-${index}`}
                  bucket={STORAGE_BUCKETS.FINANCIAL_DOCUMENTS}
                  maxSize={FILE_SIZE_LIMITS.FINANCIAL_DOCUMENT_PDF_MAX_SIZE}
                  allowedTypes={[...ALLOWED_FILE_TYPES.PDFS]}
                  accept="application/pdf"
                  label={`Archivo PDF ${index + 1}`}
                  helperText="Sólo PDF, hasta 50 MB."
                  value={url}
                  onChange={(value) => setPdf(index, value)}
                  disabled={saving}
                  variant="file"
                />
              ))}
            </Box>

            <Button
              startIcon={<AddIcon />}
              onClick={() => setPdfUrls((current) => [...current, ''])}
              disabled={saving}
              sx={{ mt: 2 }}
            >
              Agregar otro PDF
            </Button>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeFormDialog} disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            >
              {saving
                ? 'Guardando...'
                : editingDocument
                  ? 'Guardar cambios'
                  : 'Crear publicación'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => !deleteLoading && setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Confirmás la eliminación de <strong>{selectedDocument?.title}</strong>? También se
            eliminarán sus PDFs del almacenamiento.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
