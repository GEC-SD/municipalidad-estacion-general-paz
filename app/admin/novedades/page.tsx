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
  TablePagination,
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
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/state/redux/store';
import {
  getNewsAsync,
  deleteNewsAsync,
  setNewsFilters,
  clearNewsStatus,
} from '@/state/redux/news';
import { ADMIN_ROUTES, NEWS_CATEGORIES, NEWS_STATUS } from '@/constants';
import { useDebounce } from '@/hooks';
import { News } from '@/types';

const NovedadesListPage = () => {
  const dispatch = useAppDispatch();
  const { newsList, pagination, filters, status } = useAppSelector(
    (state) => state.news
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(filters.search || '', 500);

  useEffect(() => {
    dispatch(
      getNewsAsync({
        page: page + 1,
        limit: rowsPerPage,
        filters,
      })
    );
  }, [dispatch, page, rowsPerPage, filters.status, filters.category, debouncedSearch]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, news: News) => {
    setAnchorEl(event.currentTarget);
    setSelectedNews(news);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNews) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(deleteNewsAsync(selectedNews.id));
      if (result.meta.requestStatus === 'fulfilled') {
        setDeleteDialogOpen(false);
        setSelectedNews(null);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNewsFilters({ ...filters, search: e.target.value }));
    setPage(0);
  };

  const handleStatusFilterChange = (e: any) => {
    const status = e.target.value;
    dispatch(
      setNewsFilters({
        ...filters,
        status: status === 'all' ? undefined : status,
      })
    );
    setPage(0);
  };

  const handleCategoryFilterChange = (e: any) => {
    const category = e.target.value;
    dispatch(
      setNewsFilters({
        ...filters,
        category: category === 'all' ? undefined : category,
      })
    );
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const loading = status.getNewsAsync?.loading;

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
          Novedades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href={ADMIN_ROUTES.ADMIN_NOVEDADES_NUEVA}
        >
          Nueva Novedad
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            label="Buscar"
            size="small"
            value={filters.search || ''}
            onChange={handleSearchChange}
            sx={{ flex: 1 }}
            placeholder="Buscar por título..."
          />
          <TextField
            select
            label="Estado"
            size="small"
            value={filters.status || 'all'}
            onChange={handleStatusFilterChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Todos</MenuItem>
            {NEWS_STATUS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Categoría"
            size="small"
            value={filters.category || 'all'}
            onChange={handleCategoryFilterChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">Todas</MenuItem>
            {NEWS_CATEGORIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Título</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Categoría</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={100} /></TableCell>
                      <TableCell><Skeleton width={40} /></TableCell>
                    </TableRow>
                  ))
                : newsList.map((news) => (
                    <TableRow key={news.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {news.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {news.category && (
                          <Chip
                            label={
                              NEWS_CATEGORIES.find((c) => c.value === news.category)
                                ?.label || news.category
                            }
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            NEWS_STATUS.find((s) => s.value === news.status)
                              ?.label || news.status
                          }
                          size="small"
                          color={getStatusColor(news.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(news.published_at || news.created_at)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, news)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          component={Link}
          href={`/novedades/${selectedNews?.slug}`}
          target="_blank"
          onClick={handleMenuClose}
        >
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          Ver
        </MenuItem>
        <MenuItem
          component={Link}
          href={ADMIN_ROUTES.ADMIN_NOVEDADES_EDITAR(selectedNews?.id || '')}
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
            ¿Estás seguro que deseas eliminar la novedad "{selectedNews?.title}"?
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

export default NovedadesListPage;
