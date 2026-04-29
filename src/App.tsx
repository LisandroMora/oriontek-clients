import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';

import { store } from './store/store';
import { theme } from './theme/theme';

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>Redux configurado. Listo para construir páginas.</div>
      </ThemeProvider>
    </Provider>
  );
}