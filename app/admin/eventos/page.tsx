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
  Menu,
  MenuItem,
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
import { getEventsAsync, deleteEventAsync } from '@/state/redux/events';
import { ADMIN_ROUTES, EVENT_CATEGORIES } from '@/constants';
import { Event } from '@/types';

const EventosListPage = () => {
  const dispatch = useAppDispatch();
  const { events, status } = useAppSelector((state) => state.events);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getEventsAsync({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, ev: Event) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(ev);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteEventAsync(selectedEvent.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setDeleteDialogOpen(false);
        setSelectedEvent(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return EVENT_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getCategoryColor = (category: string): 'primary' | 'secondary' | 'warning' | 'info' | 'success' => {
    const colors: Record<string, 'primary' | 'secondary' | 'warning' | 'info' | 'success'> = {
      cultural: 'secondary',
      deportivo: 'warning',
      institucional: 'primary',
      educativo: 'info',
      social: 'success',
    };
    return colors[category] || 'primary';
  };

  const formatDate = (date: string) => {
    return new Date(date + 'T00:00:00').toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isUpcoming = (date: string) => {
    return new Date(date) >= new Date(new Date().toISOString().split('T')[0]);
  };

  const loading = status.getEventsAsync?.loading;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Eventos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href={ADMIN_ROUTES.ADMIN_EVENTOS_NUEVO}
        >
          Nuevo Evento
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={40} /></TableCell>
                    </TableRow>
                  ))
                : events.map((ev) => (
                    <TableRow key={ev.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {ev.title}
                        </Typography>
                        {ev.location && (
                          <Typography variant="caption" color="text.secondary">
                            {ev.location}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(ev.event_date)}
                        </Typography>
                        {ev.event_time && (
                          <Typography variant="caption" color="text.secondary">
                            {ev.event_time}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getCategoryLabel(ev.category)}
                          size="small"
                          color={getCategoryColor(ev.category)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {isUpcoming(ev.event_date) ? (
                          <Chip label="Próximo" size="small" color="success" />
                        ) : (
                          <Chip label="Pasado" size="small" color="default" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, ev)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          component={Link}
          href={ADMIN_ROUTES.ADMIN_EVENTOS_EDITAR(selectedEvent?.id || '')}
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el evento "{selectedEvent?.title}"?
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

export default EventosListPage;
