import { Box, Button, CssBaseline, ThemeProvider, Typography } from '@mui/material';

import { theme } from './theme/theme';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4 }}>
        <Typography variant="h1" gutterBottom>
          OrionTek - Gestión de Clientes
        </Typography>
        <Button variant="contained">test btn</Button>
      </Box>
    </ThemeProvider>
  );
}