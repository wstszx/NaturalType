import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
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

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, currentKey, scheme }) => {
  console.log('Rendering Keyboard. currentKey:', currentKey);

  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [rippleOrigin, setRippleOrigin] = useState<{ row: number; col: number } | null>(null);
  const renderCount = useRef(0);

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

  const getKeyStyle = useCallback((key: string): SxProps<Theme> => {
    const isHighlighted = currentKey.toLowerCase().includes(key.toLowerCase());
    const keyPosition = getKeyPosition(key);
    
    const baseStyle: SxProps<Theme> = {
      minWidth: 40, // Increase minimum width
      height: 50, // Increase height
      padding: '4px', // Increase padding
      fontSize: '0.8rem', // Increase font size
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
      flex: 1, // Make all keys flex to fill the space
    };

    let style: SxProps<Theme> = { ...baseStyle };

    // Adjust width for specific keys
    switch (key) {
      case 'Backspace':
        (style as any).flex = 1.5;
        break;
      case 'Tab':
      case 'CapsLock':
      case 'Enter':
      case 'ShiftLeft':
      case 'ShiftRight':
        (style as any).flex = 1.8;
        break;
      case 'Space':
        (style as any).flex = 6;
        break;
      case 'CtrlLeft':
      case 'CtrlRight':
      case 'Win':
      case 'AltLeft':
      case 'AltRight':
      case 'Fn':
        (style as any).flex = 1.2;
        break;
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
      console.log(`Highlighting key: ${key}`); // 添加高亮日志
      style = {
        ...style,
        backgroundColor: '#FFA726', // 使用更明显的颜色
        boxShadow: '0 0 15px rgba(255, 167, 38, 0.7)',
        animation: `${rainbowLights} 1.5s infinite`,
      };
    }

    return style;
  }, [pressedKey, rippleOrigin, currentKey, getKeyPosition]);

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
        maxWidth: '1100px', // Increase max width
        margin: '0 auto',
      }}>
        {keys.map((row, rowIndex) => (
          <Grid container justifyContent="center" key={rowIndex} spacing={0.5} sx={{ mb: 0.5 }}>
            {row.map((key) => {
              const { shengmu, yunmu } = getShuangpinLabel(key);
              const isLetterKey = /^[a-zA-Z]$/.test(key);
              return (
                <Grid item key={key} sx={{ flex: 1, display: 'flex' }}>
                  <Button
                    variant="contained"
                    onMouseDown={() => {
                      setPressedKey(key);
                      onKeyPress(key);
                      triggerRippleEffect(key);
                    }}
                    onMouseUp={() => setPressedKey(null)}
                    onMouseLeave={() => setPressedKey(null)}
                    sx={{
                      ...getKeyStyle(key),
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: isLetterKey ? 'flex-start' : 'center',
                      lineHeight: 1,
                      width: '100%',
                    }}
                  >
                    {isLetterKey ? (
                      <>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', marginRight: '4px', fontSize: '0.8rem' }}>
                          {getKeyLabel(key)}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant="caption" component="div" sx={{ color: '#E57373', fontSize: '0.6rem' }}>
                            {shengmu}
                          </Typography>
                          {yunmu.map((ym, index) => (
                            <Typography key={index} variant="caption" component="div" sx={{ color: '#64B5F6', fontSize: '0.6rem' }}>
                              {ym}
                            </Typography>
                          ))}
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {getKeyLabel(key)}
                      </Typography>
                    )}
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
