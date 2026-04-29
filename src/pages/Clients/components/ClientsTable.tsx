import { DeleteOutlined, EditOutlined, LocationOnOutlined } from '@mui/icons-material';
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';


import type { Client } from '@/types';
import { formatDate } from '@/utils/helpers';

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export const ClientsTable = memo(function ClientsTable({
  clients,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Contacto</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Direcciones</TableCell>
            <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Creado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              hover
              sx={{
                '&:last-child td': { border: 0 },
                transition: 'background-color 150ms',
              }}
            >
              <TableCell>
                <RouterLink
                  to={`/clients/${client.id}`}
                  style={{
                    color: '#1976d2',
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  {client.firstName} {client.lastName}
                </RouterLink>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.25 }}
                >
                  {client.documentId}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Typography variant="body2">{client.email}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {client.phone}
                </Typography>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Chip
                  icon={<LocationOnOutlined sx={{ fontSize: 14 }} />}
                  label={client.addresses.length}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                  }}
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(client.createdAt)}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                <IconButton
                  size="small"
                  onClick={() => onEdit(client)}
                  aria-label={`Editar ${client.firstName}`}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(client.id)}
                  aria-label={`Eliminar ${client.firstName}`}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});