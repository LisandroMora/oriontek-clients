import { AddOutlined, CloseOutlined, PeopleOutlined, SearchOutlined } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Pagination,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';


import { ClientForm } from './components/ClientForm';
import { ClientsTable } from './components/ClientsTable';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  makeSelectFilteredClients,
  selectClientsCount,
  selectError,
  selectLoading,
} from '@/store/clientsSelectors';
import {
  createClient,
  deleteClient,
  fetchClients,
  updateClient,
} from '@/store/clientsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Client, ClientFormData } from '@/types';

const PAGE_SIZE = 15;

export default function ClientsPage() {
  const dispatch = useAppDispatch();

  const selectFilteredClients = useMemo(() => makeSelectFilteredClients(), []);

  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const totalCount = useAppSelector(selectClientsCount);

  const [search, setSearch] = useState('');
  const filtered = useAppSelector((state) => selectFilteredClients(state, search));

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const { paginated, totalPages } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, total);
    return {
      paginated: filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
      totalPages: total,
    };
  }, [filtered, page]);

  const handleCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((client: Client) => {
    setEditing(client);
    setFormOpen(true);
  }, []);

  const handleRequestDelete = useCallback((id: string) => {
    setDeletingId(id);
  }, []);

  const handleSubmit = async (data: ClientFormData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await dispatch(updateClient({ id: editing.id, data })).unwrap();
        setToast({ message: 'Cliente actualizado', type: 'success' });
      } else {
        await dispatch(createClient(data)).unwrap();
        setToast({ message: 'Cliente creado', type: 'success' });
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      setToast({ message: typeof err === 'string' ? err : 'Error al guardar', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await dispatch(deleteClient(deletingId)).unwrap();
      setToast({ message: 'Cliente eliminado', type: 'success' });
      setDeletingId(null);
    } catch (err) {
      setToast({ message: typeof err === 'string' ? err : 'Error al eliminar', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    if (submitting) return;
    setFormOpen(false);
    setEditing(null);
  };

  if (loading && totalCount === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && totalCount === 0) {
    return <ErrorState title="Error al cargar" message={error} />;
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontSize: '1.75rem', mb: 0.5 }}>
            Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} {totalCount === 1 ? 'cliente registrado' : 'clientes registrados'}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={handleCreate}>
          Nuevo cliente
        </Button>
      </Stack>

      <TextField
        placeholder="Buscar por nombre, email o documento..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  aria-label="Limpiar búsqueda"
                  sx={{ mr: -0.5 }}
                >
                  <CloseOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{
          maxWidth: 480,
          alignSelf: 'flex-end',
          '& .MuiOutlinedInput-root': {
            bgcolor: '#fff',
            transition: 'box-shadow 150ms',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.2)',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
            },
          },
        }}
      />

      {totalCount === 0 ? (
        <EmptyState
          icon={PeopleOutlined}
          title="No hay clientes"
          description="Crea el primer cliente para empezar."
          action={
            <Button variant="contained" startIcon={<AddOutlined />} onClick={handleCreate}>
              Crear cliente
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchOutlined}
          title="Sin resultados"
          description={`No hay clientes que coincidan con "${search}".`}
        />
      ) : (
        <>
          <ClientsTable
            clients={paginated}
            onEdit={handleEdit}
            onDelete={handleRequestDelete}
          />

          {totalPages > 1 && (
            <Stack sx={{ alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}

      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
        <DialogContent dividers>
          <ClientForm
            initialData={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            submitLabel={editing ? 'Actualizar' : 'Crear'}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        title="Eliminar cliente"
        message="¿Seguro que quieres eliminar este cliente? También se eliminarán sus direcciones."
        confirmLabel="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.type} variant="filled" onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}