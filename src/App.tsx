import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Keyboard as KeyboardIcon } from 'lucide-react';
import TypingPractice from './components/TypingPractice';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
    },
    secondary: {
      main: '#958DA5',
    },
    background: {
      default: '#FFFBFE',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            <KeyboardIcon size={32} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Natural Code Typing Practice
          </Typography>
          <TypingPractice />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;