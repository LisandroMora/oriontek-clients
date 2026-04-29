import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(7, 'Teléfono inválido')
    .regex(/^[\d\s+()-]+$/, 'Solo dígitos y símbolos +-() permitidos'),
  documentId: z
    .string()
    .min(5, 'Documento debe tener al menos 5 caracteres')
    .max(20, 'Máximo 20 caracteres'),
});

export const addressSchema = z.object({
  street: z.string().min(3, 'Calle requerida (mínimo 3 caracteres)'),
  city: z.string().min(2, 'Ciudad requerida'),
  state: z.string().min(2, 'Estado/Provincia requerido'),
  country: z.string().min(2, 'País requerido'),
  zipCode: z.string().min(3, 'Código postal requerido'),
  isPrimary: z.boolean(),
});

export type ClientSchema = z.infer<typeof clientSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;