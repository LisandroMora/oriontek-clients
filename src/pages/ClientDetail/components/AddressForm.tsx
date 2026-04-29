import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import type { Address } from '@/types';
import { addressSchema, type AddressSchema } from '@/utils/validators';

interface AddressFormProps {
  initialData?: Address;
  onSubmit: (data: AddressSchema) => void;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  loading = false,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData
      ? {
          street: initialData.street,
          city: initialData.city,
          state: initialData.state,
          country: initialData.country,
          zipCode: initialData.zipCode,
          isPrimary: initialData.isPrimary,
        }
      : {
          street: '',
          city: '',
          state: '',
          country: 'República Dominicana',
          zipCode: '',
          isPrimary: false,
        },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        <TextField
          label="Calle y número"
          {...register('street')}
          error={!!errors.street}
          helperText={errors.street?.message}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Ciudad"
            {...register('city')}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
          <TextField
            label="Estado / Provincia"
            {...register('state')}
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="País"
            {...register('country')}
            error={!!errors.country}
            helperText={errors.country?.message}
          />
          <TextField
            label="Código postal"
            {...register('zipCode')}
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
          />
        </Stack>

        <Controller
          name="isPrimary"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Marcar como dirección principal"
            />
          )}
        />

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