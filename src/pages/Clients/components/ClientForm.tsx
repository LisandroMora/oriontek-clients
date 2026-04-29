import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';

import type { Client } from '@/types';
import { clientSchema, type ClientSchema } from '@/utils/validators';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientSchema) => void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  loading = false,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone,
          documentId: initialData.documentId,
        }
      : undefined,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Nombre"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            placeholder="Juan"
          />
          <TextField
            label="Apellido"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            placeholder="Pérez"
          />
        </Stack>

        <TextField
          label="Email"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          placeholder="juan.perez@example.com"
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Teléfono"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            placeholder="+1 809-555-0123"
          />
          <TextField
            label="Documento de identidad"
            {...register('documentId')}
            error={!!errors.documentId}
            helperText={errors.documentId?.message}
            placeholder="00112345678"
          />
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end', pt: 2 }}>
          <Button onClick={onCancel} color="inherit" disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Guardando...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}