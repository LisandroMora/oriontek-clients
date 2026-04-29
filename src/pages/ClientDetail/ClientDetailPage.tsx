import {
  ArrowBackOutlined,
  CalendarMonthOutlined,
  EmailOutlined,
  LocalPhoneOutlined,
  PersonOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import { AddressList } from './components/AddressList';

import { ErrorState } from '@/components/ui/ErrorState';
import { selectClientById, selectError, selectLoading } from '@/store/clientsSelectors';
import { fetchClients } from '@/store/clientsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatDate } from '@/utils/helpers';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Box sx={{ color: 'text.secondary', mt: 0.5 }}>{icon}</Box>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Stack>
  );
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const client = useAppSelector(selectClientById(id ?? ''));

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  if (loading && !client) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !client) {
    return <ErrorState title="Error al cargar" message={error} />;
  }

  if (!client) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Cliente no encontrado.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate('/')}>
          Volver al listado
        </Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackOutlined />}
        sx={{ alignSelf: 'flex-start' }}
        color="inherit"
      >
        Volver
      </Button>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.light',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            {client.firstName[0]}
            {client.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
              {client.firstName} {client.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cliente desde {formatDate(client.createdAt)}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <InfoItem icon={<EmailOutlined fontSize="small" />} label="Email" value={client.email} />
          <InfoItem
            icon={<LocalPhoneOutlined fontSize="small" />}
            label="Teléfono"
            value={client.phone}
          />
          <InfoItem
            icon={<PersonOutlined fontSize="small" />}
            label="Documento"
            value={client.documentId}
          />
          <InfoItem
            icon={<CalendarMonthOutlined fontSize="small" />}
            label="Última actualización"
            value={formatDate(client.updatedAt)}
          />
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <AddressList clientId={client.id} addresses={client.addresses} />
      </Paper>
    </Stack>
  );
}