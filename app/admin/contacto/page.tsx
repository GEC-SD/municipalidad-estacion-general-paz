'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getContactsAsync,
  deleteContactAsync,
  clearContactStatus,
} from '@/state/redux/contact';
import { ADMIN_ROUTES, CONTACT_CATEGORIES } from '@/constants';
import { ContactInfo, ContactCategory } from '@/types';

const ContactoListPage = () => {
  const dispatch = useAppDispatch();
  const { contacts, status } = useAppSelector((state) => state.contact);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<ContactInfo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getContactsAsync());
  }, [dispatch]);

  const filteredContacts = categoryFilter === 'all'
    ? contacts
    : contacts.filter((c) => c.category === categoryFilter);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, contact: ContactInfo) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedContact) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteContactAsync(selectedContact.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setDeleteDialogOpen(false);
        setSelectedContact(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryColor = (category: ContactCategory): 'error' | 'primary' | 'info' => {
    const colors: Record<ContactCategory, 'error' | 'primary' | 'info'> = {
      emergencia: 'error',
      administrativo: 'primary',
      servicios: 'info',
    };
    return colors[category] || 'primary';
  };

  const loading = status.getContactsAsync?.loading;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Contacto
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href={ADMIN_ROUTES.ADMIN_CONTACTO_NUEVO}
        >
          Nuevo Contacto
        </Button>
      </Box>

      {/* Filter */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          select
          label="Categoría"
          size="small"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Todas</MenuItem>
          {CONTACT_CATEGORIES.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Departamento</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Teléfono</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={120} /></TableCell>
                      <TableCell><Skeleton width={60} /></TableCell>
                      <TableCell><Skeleton width={40} /></TableCell>
                    </TableRow>
                  ))
                : filteredContacts.map((contact) => (
                    <TableRow key={contact.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {contact.department}
                        </Typography>
                        {contact.description && (
                          <Typography variant="caption" color="text.secondary">
                            {contact.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={CONTACT_CATEGORIES.find((c) => c.value === contact.category)?.label || contact.category}
                          size="small"
                          color={getCategoryColor(contact.category)}
                        />
                      </TableCell>
                      <TableCell>{contact.phone || '-'}</TableCell>
                      <TableCell>{contact.email || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.is_active ? 'Activo' : 'Inactivo'}
                          size="small"
                          color={contact.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, contact)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Empty state */}
      {!loading && filteredContacts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            No hay contactos registrados
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
            Creá el primer contacto para mostrarlo en el sitio público
          </Typography>
        </Box>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          component={Link}
          href={ADMIN_ROUTES.ADMIN_CONTACTO_EDITAR(selectedContact?.id || '')}
          onClick={handleMenuClose}
        >
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el contacto "{selectedContact?.department}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>Cancelar</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : undefined}
          >
            {deleteLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactoListPage;
