import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  LocationOnOutlined,
  Star,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';

import { AddressForm } from './AddressForm';
import styles from './AddressList.module.scss';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { addAddress, deleteAddress, updateAddress } from '@/store/clientsSlice';
import { useAppDispatch } from '@/store/hooks';
import type { Address, AddressFormData } from '@/types';

interface AddressListProps {
  clientId: string;
  addresses: Address[];
}

export function AddressList({ clientId, addresses }: AddressListProps) {
  const dispatch = useAppDispatch();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sorted = [...addresses].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleSubmit = async (data: AddressFormData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await dispatch(updateAddress({ clientId, addressId: editing.id, data })).unwrap();
        setToast({ message: 'Dirección actualizada', type: 'success' });
      } else {
        await dispatch(addAddress({ clientId, data })).unwrap();
        setToast({ message: 'Dirección agregada', type: 'success' });
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
    try {
      await dispatch(deleteAddress({ clientId, addressId: deletingId })).unwrap();
      setToast({ message: 'Dirección eliminada', type: 'success' });
      setDeletingId(null);
    } catch (err) {
      setToast({ message: typeof err === 'string' ? err : 'Error al eliminar', type: 'error' });
    }
  };

  return (
    <Box>
      <div className={styles.header}>
        <h2 className={styles.title}>Direcciones ({addresses.length})</h2>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddOutlined />}
          onClick={handleCreate}
        >
          Agregar
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={LocationOnOutlined}
          title="Sin direcciones"
          description="Agrega la primera dirección para este cliente."
          action={
            <Button variant="contained" startIcon={<AddOutlined />} onClick={handleCreate}>
              Agregar dirección
            </Button>
          }
        />
      ) : (
        <ul className={styles.grid}>
          {sorted.map((address) => (
            <li key={address.id} className={styles.card}>
              <div className={styles.cardContent}>
                <LocationOnOutlined className={styles.icon} />
                <div className={styles.text}>
                  <p className={styles.street}>{address.street}</p>
                  <p className={styles.location}>
                    {address.city}, {address.state}
                  </p>
                  <p className={styles.country}>
                    {address.country} · {address.zipCode}
                  </p>
                  {address.isPrimary && (
                    <Chip
                      icon={<Star sx={{ fontSize: 14 }} />}
                      label="Principal"
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ mt: 1, height: 22 }}
                    />
                  )}
                </div>
              </div>
              <div className={styles.actions}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(address)}
                  aria-label="Editar dirección"
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setDeletingId(address.id)}
                  aria-label="Eliminar dirección"
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? 'Editar dirección' : 'Nueva dirección'}</DialogTitle>
        <DialogContent dividers>
          <AddressForm
            initialData={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              if (submitting) return;
              setFormOpen(false);
              setEditing(null);
            }}
            submitLabel={editing ? 'Actualizar' : 'Agregar'}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        title="Eliminar dirección"
        message="¿Seguro que quieres eliminar esta dirección?"
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
    </Box>
  );
}