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
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import { getAllPublicWorksAsync, deletePublicWorkAsync } from '@/state/redux/publicWorks';
import { ADMIN_ROUTES } from '@/constants';
import { PublicWork } from '@/types';

const ObrasListPage = () => {
  const dispatch = useAppDispatch();
  const { publicWorks = [], status } = useAppSelector((state) => state.publicWorks);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWork, setSelectedWork] = useState<PublicWork | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // useEffect(() => {
  //   dispatch(getAllPublicWorksAsync());
  // }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, work: PublicWork) => {
    setAnchorEl(event.currentTarget);
    setSelectedWork(work);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedWork) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(deletePublicWorkAsync(selectedWork.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setDeleteDialogOpen(false);
        setSelectedWork(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const loading = status.getAllPublicWorksAsync?.loading;

  return (
    // <Box>
    //   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    //     <Typography variant="h4" sx={{ fontWeight: 700 }}>
    //       Obras Públicas
    //     </Typography>
    //     <Button
    //       variant="contained"
    //       startIcon={<AddIcon />}
    //       component={Link}
    //       href={ADMIN_ROUTES.ADMIN_OBRAS_NUEVA}
    //     >
    //       Nueva Obra
    //     </Button>
    //   </Box>

    //   <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
    //     <TableContainer>
    //       <Table>
    //         <TableHead>
    //           <TableRow sx={{ backgroundColor: 'primary.main' }}>
    //             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Título</TableCell>
    //             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Ubicación</TableCell>
    //             <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
    //             <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Acciones</TableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {loading
    //             ? Array.from(new Array(5)).map((_, index) => (
    //                 <TableRow key={index}>
    //                   <TableCell><Skeleton /></TableCell>
    //                   <TableCell><Skeleton width={120} /></TableCell>
    //                   <TableCell><Skeleton width={60} /></TableCell>
    //                   <TableCell><Skeleton width={40} /></TableCell>
    //                 </TableRow>
    //               ))
    //             : publicWorks.map((work) => (
    //                 <TableRow key={work.id} hover>
    //                   <TableCell>
    //                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
    //                       {work.title}
    //                     </Typography>
    //                   </TableCell>
    //                   <TableCell>
    //                     {work.address ? (
    //                       <Chip
    //                         icon={<LocationOnIcon sx={{ fontSize: 14 }} />}
    //                         label={work.address}
    //                         size="small"
    //                         variant="outlined"
    //                       />
    //                     ) : (
    //                       <Typography variant="body2" color="text.secondary">
    //                         Sin ubicación
    //                       </Typography>
    //                     )}
    //                   </TableCell>
    //                   <TableCell>
    //                     <Chip
    //                       label={work.is_active ? 'Activo' : 'Inactivo'}
    //                       size="small"
    //                       color={work.is_active ? 'success' : 'default'}
    //                     />
    //                   </TableCell>
    //                   <TableCell align="right">
    //                     <IconButton size="small" onClick={(e) => handleMenuOpen(e, work)}>
    //                       <MoreVertIcon />
    //                     </IconButton>
    //                   </TableCell>
    //                 </TableRow>
    //               ))}
    //           {!loading && publicWorks.length === 0 && (
    //             <TableRow>
    //               <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
    //                 <Typography variant="body2" color="text.secondary">
    //                   No hay obras públicas registradas. Creá la primera.
    //                 </Typography>
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   </Paper>

    //   <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
    //     <MenuItem
    //       component={Link}
    //       href={ADMIN_ROUTES.ADMIN_OBRAS_EDITAR(selectedWork?.id || '')}
    //       onClick={handleMenuClose}
    //     >
    //       <EditIcon sx={{ mr: 1 }} fontSize="small" />
    //       Editar
    //     </MenuItem>
    //     <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
    //       <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
    //       Eliminar
    //     </MenuItem>
    //   </Menu>

    //   <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
    //     <DialogTitle>Confirmar eliminación</DialogTitle>
    //     <DialogContent>
    //       <Typography>
    //         ¿Estás seguro que deseas eliminar la obra &quot;{selectedWork?.title}&quot;?
    //       </Typography>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>Cancelar</Button>
    //       <Button
    //         onClick={handleDeleteConfirm}
    //         color="error"
    //         variant="contained"
    //         disabled={deleteLoading}
    //         startIcon={deleteLoading ? <CircularProgress size={20} /> : undefined}
    //       >
    //         {deleteLoading ? 'Eliminando...' : 'Eliminar'}
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </Box>
    <></>
  );
};

export default ObrasListPage;
