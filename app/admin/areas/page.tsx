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
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getServicesAsync, deleteServiceAsync } from '@/state/redux/services';
import { ADMIN_ROUTES, SERVICE_CATEGORIES } from '@/constants';
import { Service } from '@/types';

const AreasListPage = () => {
  const dispatch = useAppDispatch();
  const { services, status } = useAppSelector((state) => state.services);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getServicesAsync());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: Service) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteServiceAsync(selectedService.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setDeleteDialogOpen(false);
        setSelectedService(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return SERVICE_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const loading = status.getServicesAsync?.loading;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Areas
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DescriptionIcon />}
            component={Link}
            href={ADMIN_ROUTES.ADMIN_RESENAS}
          >
            Gestionar Reseñas
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href={`${ADMIN_ROUTES.ADMIN_SERVICIOS}/nuevo`}
          >
            Nueva Area
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Título</TableCell>
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
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={60} /></TableCell>
                      <TableCell><Skeleton width={40} /></TableCell>
                    </TableRow>
                  ))
                : services.map((service) => (
                    <TableRow key={service.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {service.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={getCategoryLabel(service.category)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={service.is_active ? 'Activo' : 'Inactivo'}
                          size="small"
                          color={service.is_active ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, service)}>
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
          href={ADMIN_ROUTES.ADMIN_SERVICIOS_EDITAR(selectedService?.id || '')}
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
            ¿Estás seguro que deseas eliminar el area &quot;{selectedService?.title}&quot;?
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

export default AreasListPage;
