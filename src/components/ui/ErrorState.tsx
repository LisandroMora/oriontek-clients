import { ErrorOutlineOutlined } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Button } from '@mui/material';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Algo salió mal', message, onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      icon={<ErrorOutlineOutlined />}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Reintentar
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      <Box>{message}</Box>
    </Alert>
  );
}