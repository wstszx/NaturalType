import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { keyframes } from '@emotion/react';
import { SxProps, Theme } from '@mui/system';
import { ShuangpinScheme } from '../data/shuangpinSchemes';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  currentKey: string;
  scheme: ShuangpinScheme;
}

const keys = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
  ['CtrlLeft', 'Win', 'AltLeft', 'Space', 'AltRight', 'Fn', 'CtrlRight']
];

const rainbowColors = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'
];

const rainbowLights = keyframes`
  0%, 100% { box-shadow: 0 0 5px ${rainbowColors[0]}, 0 0 10px ${rainbowColors[0]}, 0 0 15px ${rainbowColors[0]}; }
  14% { box-shadow: 0 0 5px ${rainbowColors[1]}, 0 0 10px ${rainbowColors[1]}, 0 0 15px ${rainbowColors[1]}; }
  28% { box-shadow: 0 0 5px ${rainbowColors[2]}, 0 0 10px ${rainbowColors[2]}, 0 0 15px ${rainbowColors[2]}; }
  42% { box-shadow: 0 0 5px ${rainbowColors[3]}, 0 0 10px ${rainbowColors[3]}, 0 0 15px ${rainbowColors[3]}; }
  57% { box-shadow: 0 0 5px ${rainbowColors[4]}, 0 0 10px ${rainbowColors[4]}, 0 0 15px ${rainbowColors[4]}; }
  71% { box-shadow: 0 0 5px ${rainbowColors[5]}, 0 0 10px ${rainbowColors[5]}, 0 0 15px ${rainbowColors[5]}; }
  85% { box-shadow: 0 0 5px ${rainbowColors[6]}, 0 0 10px ${rainbowColors[6]}, 0 0 15px ${rainbowColors[6]}; }
`;

// Add new light effect types
type LightEffect = 'rainbow' | 'pulse' | 'wave' | 'static' | 'sparkle' | 'neon' | 'gradient' | 'typing';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log('Keyboard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the Keyboard.</h1>;
    }

    return this.props.children;
  }
}

const pulseLight = keyframes`
  0%, 100% { box-shadow: 0 0 5px #FFA726, 0 0 10px #FFA726, 0 0 15px #FFA726; }
  50% { box-shadow: 0 0 10px #FF6F00, 0 0 20px #FF6F00, 0 0 30px #FF6F00; }
`;

const waveLight = keyframes`
  0% { box-shadow: 0 0 5px #4FC3F7, 0 0 10px #4FC3F7, 0 0 15px #4FC3F7; }
  33% { box-shadow: 0 0 5px #81C784, 0 0 10px #81C784, 0 0 15px #81C784; }
  66% { box-shadow: 0 0 5px #FFD54F, 0 0 10px #FFD54F, 0 0 15px #FFD54F; }
  100% { box-shadow: 0 0 5px #4FC3F7, 0 0 10px #4FC3F7, 0 0 15px #4FC3F7; }
`;

const sparkleLight = keyframes`
  0%, 100% { box-shadow: 0 0 4px #FFF, 0 0 8px #FFF, 0 0 12px #FFF, 0 0 16px #FF00DE, 0 0 30px #FF00DE; }
  50% { box-shadow: 0 0 4px #FFF, 0 0 8px #FFF, 0 0 12px #FFF, 0 0 16px #00FFFF, 0 0 30px #00FFFF; }
`;

const neonLight = keyframes`
  0%, 100% { box-shadow: 0 0 5px #FF00DE, 0 0 10px #FF00DE, 0 0 15px #FF00DE, 0 0 20px #FF00DE; }
  50% { box-shadow: 0 0 10px #FF00DE, 0 0 20px #FF00DE, 0 0 30px #FF00DE, 0 0 40px #FF00DE; }
`;

const gradientLight = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const typingLight = keyframes`
  0%, 100% { box-shadow: 0 0 5px #4CAF50, 0 0 10px #4CAF50; }
  50% { box-shadow: 0 0 20px #4CAF50, 0 0 30px #4CAF50; }
`;

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, currentKey, scheme }) => {
  console.log('Rendering Keyboard. currentKey:', currentKey);

  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [rippleOrigin, setRippleOrigin] = useState<{ row: number; col: number } | null>(null);
  const renderCount = useRef(0);

  // Add new state for light effect
  const [lightEffect, setLightEffect] = useState<LightEffect>('rainbow');

  const getKeyPosition = useCallback((key: string) => {
    for (let row = 0; row < keys.length; row++) {
      const col = keys[row].indexOf(key);
      if (col !== -1) {
        return { row, col };
      }
    }
    return null;
  }, []);

  const triggerRippleEffect = useCallback((startKey: string) => {
    const position = getKeyPosition(startKey);
    if (position) {
      setRippleOrigin(position);
      setTimeout(() => setRippleOrigin(null), 1000); // Clear ripple effect after animation
    }
  }, [getKeyPosition]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      setPressedKey(key);
      onKeyPress(key);
      triggerRippleEffect(key);
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress, triggerRippleEffect]);

  useEffect(() => {
    renderCount.current += 1;
    console.log('Keyboard render count:', renderCount.current);
  });

  useEffect(() => {
    console.log('Current key updated:', currentKey);
  }, [currentKey]);

  const getKeyStyle = useCallback((key: string): SxProps<Theme> & { flexGrow: number; width?: string } => {
    const isHighlighted = currentKey.toLowerCase().includes(key.toLowerCase());
    const keyPosition = getKeyPosition(key);
    
    const baseStyle: SxProps<Theme> & { flexGrow: number; width?: string } = {
      minWidth: 40,
      height: 50,
      padding: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      transition: 'all 0.1s ease',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #6750A4',
      borderRadius: '4px',
      backgroundColor: isHighlighted ? '#E8DEF8' : '#EADDFF',
      color: '#1C1B1F',
      '&:hover': {
        backgroundColor: '#D0BCFF',
      },
      transform: 'scale(1)',
      boxShadow: 'none',
      animation: 'none',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    };

    let style: SxProps<Theme> & { flexGrow: number; width?: string } = { ...baseStyle };

    // 为字母键设置固定宽度
    if (/^[a-zA-Z]$/.test(key)) {
      style.width = '55px';  // 或者其他适合的固定宽度
      style.flexGrow = 0;    // 防止 flex 增长
    } else {
      // 其他键的 flexGrow 逻辑保持不变
      switch (key) {
        case 'Backspace':
          style.flexGrow = 2;
          break;
        case 'Tab':
        case 'CapsLock':
          style.flexGrow = 1.5;
          break;
        case 'Enter':
          style.flexGrow = 2.25;
          break;
        case 'ShiftLeft':
          style.flexGrow = 2.25;
          break;
        case 'ShiftRight':
          style.flexGrow = 2.75;
          break;
        case 'Space':
          style.flexGrow = 6.25;
          break;
        case 'CtrlLeft':
        case 'CtrlRight':
        case 'Win':
        case 'AltLeft':
        case 'AltRight':
        case 'Fn':
          style.flexGrow = 1.25;
          break;
        default:
          if (/^[a-zA-Z]$/.test(key)) {
            style.flexGrow = 1;
          }
      }
    }

    if (key === pressedKey) {
      style = {
        ...style,
        backgroundColor: '#D0BCFF',
        transform: 'scale(0.95)',
        boxShadow: '0 0 15px rgba(103, 80, 164, 0.5)',
      };
    }

    if (rippleOrigin && keyPosition) {
      const distance = Math.sqrt(
        Math.pow(rippleOrigin.row - keyPosition.row, 2) +
        Math.pow(rippleOrigin.col - keyPosition.col, 2)
      );
      const delay = distance * 50; // 50ms delay per unit of distance
      style = {
        ...style,
        animation: `${rainbowLights} 0.7s ease-in-out`,
        animationDelay: `${delay}ms`,
      };
    }

    if (isHighlighted) {
      console.log(`Highlighting key: ${key}`);
      style = {
        ...style,
        backgroundColor: '#FFA726',
      };

      switch (lightEffect) {
        case 'rainbow':
          style.animation = `${rainbowLights} 1.5s infinite`;
          break;
        case 'pulse':
          style.animation = `${pulseLight} 1s infinite`;
          break;
        case 'wave':
          style.animation = `${waveLight} 3s infinite`;
          break;
        case 'static':
          style.boxShadow = '0 0 15px #FFA726';
          break;
        case 'sparkle':
          style.animation = `${sparkleLight} 1.5s infinite`;
          break;
        case 'neon':
          style.animation = `${neonLight} 1s infinite`;
          style.color = '#FF00DE';
          break;
        case 'gradient':
          style.backgroundImage = 'linear-gradient(45deg, #FF00DE, #00FFFF, #FF00DE)';
          style.backgroundSize = '200% 200%';
          style.animation = `${gradientLight} 3s ease infinite`;
          style.color = '#000';
          break;
        case 'typing':
          style.animation = `${typingLight} 0.5s infinite`;
          style.backgroundColor = '#E8F5E9';
          style.color = '#4CAF50';
          break;
      }
    }

    return style;
  }, [pressedKey, rippleOrigin, currentKey, getKeyPosition, lightEffect]);

  const getKeyLabel = (key: string) => {
    switch (key) {
      case 'ShiftLeft':
      case 'ShiftRight':
        return 'Shift';
      case 'CtrlLeft':
      case 'CtrlRight':
        return 'Ctrl';
      case 'AltLeft':
      case 'AltRight':
        return 'Alt';
      default:
        return key;
    }
  };

  const getShuangpinLabel = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (scheme[lowerKey]) {
      const { shengmu, yunmu } = scheme[lowerKey];
      return { 
        shengmu: shengmu || '', 
        yunmu: Array.isArray(yunmu) ? yunmu : yunmu ? [yunmu] : [] 
      };
    }
    return { shengmu: '', yunmu: [] };
  };

  return (
    <ErrorBoundary>
      <Box sx={{ 
        mt: 2, 
        p: 1,
        borderRadius: '10px',
        backgroundColor: '#F3EDF7',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        <FormControl sx={{ mb: 2, minWidth: 120, maxWidth: 200 }}>
          <InputLabel id="light-effect-label">Light Effect</InputLabel>
          <Select
            labelId="light-effect-label"
            value={lightEffect}
            label="Light Effect"
            onChange={(e) => setLightEffect(e.target.value as LightEffect)}
            sx={{ width: 'auto' }}
          >
            <MenuItem value="rainbow">Rainbow</MenuItem>
            <MenuItem value="pulse">Pulse</MenuItem>
            <MenuItem value="wave">Wave</MenuItem>
            <MenuItem value="static">Static</MenuItem>
            <MenuItem value="sparkle">Sparkle</MenuItem>
            <MenuItem value="neon">Neon</MenuItem>
            <MenuItem value="gradient">Gradient</MenuItem>
            <MenuItem value="typing">Typing</MenuItem>
          </Select>
        </FormControl>
        {keys.map((row, rowIndex) => (
          <Grid container justifyContent="center" key={rowIndex} spacing={0.5} sx={{ mb: 0.5 }}>
            {row.map((key) => {
              const { shengmu, yunmu } = getShuangpinLabel(key);
              const isLetterKey = /^[a-zA-Z]$/.test(key);
              const keyStyle = getKeyStyle(key);
              return (
                <Grid item key={key} sx={{ display: 'flex', flexGrow: keyStyle.flexGrow }}>
                  <Button
                    variant="contained"
                    onMouseDown={() => {
                      setPressedKey(key);
                      onKeyPress(key);
                      triggerRippleEffect(key);
                    }}
                    onMouseUp={() => setPressedKey(null)}
                    onMouseLeave={() => setPressedKey(null)}
                    sx={keyStyle}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      width: '100%', 
                      alignItems: 'center'
                    }}>
                      <Typography variant="body2" component="div" sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '0.8rem',
                        flexGrow: 1,
                        textAlign: 'left'
                      }}>
                        {getKeyLabel(key)}
                      </Typography>
                      {isLetterKey && (
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'flex-end',
                          ml: 1
                        }}>
                          <Typography variant="caption" component="div" sx={{ color: '#E57373', fontSize: '0.6rem' }}>
                            {shengmu}
                          </Typography>
                          {yunmu.map((ym, index) => (
                            <Typography key={index} variant="caption" component="div" sx={{ color: '#64B5F6', fontSize: '0.6rem' }}>
                              {ym}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Box>
    </ErrorBoundary>
  );
};

export default Keyboard;
