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
  Avatar,
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
import { getAuthoritiesAsync, deleteAuthorityAsync } from '@/state/redux/authorities';
import { ADMIN_ROUTES, AUTHORITY_CATEGORIES } from '@/constants';
import { Authority } from '@/types';

const AutoridadesListPage = () => {
  const dispatch = useAppDispatch();
  const { authorities, status } = useAppSelector((state) => state.authorities);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getAuthoritiesAsync());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, authority: Authority) => {
    setAnchorEl(event.currentTarget);
    setSelectedAuthority(authority);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAuthority) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteAuthorityAsync(selectedAuthority.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setDeleteDialogOpen(false);
        setSelectedAuthority(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    return AUTHORITY_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const loading = status.getAuthoritiesAsync?.loading;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Autoridades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href={ADMIN_ROUTES.ADMIN_AUTORIDADES_NUEVA}
        >
          Nueva Autoridad
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Foto</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Cargo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={40} /></TableCell>
                    </TableRow>
                  ))
                : authorities.map((authority) => (
                    <TableRow key={authority.id} hover>
                      <TableCell>
                        <Avatar src={authority.photo_url} alt={authority.full_name} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {authority.full_name}
                        </Typography>
                      </TableCell>
                      <TableCell>{authority.position}</TableCell>
                      <TableCell>
                        <Chip label={getCategoryLabel(authority.category)} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, authority)}>
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
          href={ADMIN_ROUTES.ADMIN_AUTORIDADES_EDITAR(selectedAuthority?.id || '')}
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
            ¿Estás seguro que deseas eliminar a "{selectedAuthority?.full_name}"?
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

export default AutoridadesListPage;
