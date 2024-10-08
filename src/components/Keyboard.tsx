import React, { useState, useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
import { keyframes } from '@emotion/react';
import { SxProps, Theme } from '@mui/system';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  highlightedKeys: string[];
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

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, highlightedKeys }) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [runningLightKeys, setRunningLightKeys] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      setPressedKey(key);
      onKeyPress(key);
      triggerRunningLights(key);
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
  }, [onKeyPress]);

  const triggerRunningLights = (startKey: string) => {
    const flatKeys = keys.flat();
    const startIndex = flatKeys.indexOf(startKey.toLowerCase());
    const lightSequence = [
      ...flatKeys.slice(startIndex),
      ...flatKeys.slice(0, startIndex)
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      setRunningLightKeys(prevKeys => {
        const newKeys = [...prevKeys, lightSequence[currentIndex]];
        if (newKeys.length > 7) {
          newKeys.shift();
        }
        return newKeys;
      });

      currentIndex++;
      if (currentIndex >= flatKeys.length) {
        clearInterval(interval);
        setTimeout(() => setRunningLightKeys([]), 500);
      }
    }, 50);
  };

  const getKeyStyle = (key: string): SxProps<Theme> => {
    const isHighlighted = highlightedKeys.includes(key.toLowerCase());
    const baseStyle: SxProps<Theme> = {
      minWidth: 40,
      height: 40,
      padding: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      transition: 'all 0.1s ease',
      position: 'relative',
      overflow: 'visible',
      border: '2px solid #6750A4',
      borderRadius: '4px',
      backgroundColor: isHighlighted ? '#E8DEF8' : '#EADDFF',
      color: '#1C1B1F',
      '&:hover': {
        backgroundColor: '#D0BCFF',
      },
      transform: 'scale(1)',
      boxShadow: 'none',
      animation: 'none',
    };

    let style: SxProps<Theme> = { ...baseStyle };

    // Adjust width for specific keys
    switch (key) {
      case 'Backspace':
      case 'Tab':
      case 'CapsLock':
      case 'Enter':
      case 'ShiftLeft':
      case 'ShiftRight':
        (style as any).minWidth = 70;
        break;
      case 'Space':
        (style as any).minWidth = 240;
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

    if (runningLightKeys.includes(key.toLowerCase())) {
      const index = runningLightKeys.indexOf(key.toLowerCase());
      style = {
        ...style,
        animation: `${rainbowLights} 0.7s ease-in-out`,
        animationDelay: `${index * 0.05}s`,
      };
    }

    return style;
  };

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

  return (
    <Box sx={{ 
      mt: 2, 
      p: 2, 
      borderRadius: '10px',
      backgroundColor: '#F3EDF7',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {keys.map((row, rowIndex) => (
        <Grid container justifyContent="center" key={rowIndex} spacing={0.5} sx={{ mb: 0.5 }}>
          {row.map((key) => (
            <Grid item key={key}>
              <Button
                variant="contained"
                onMouseDown={() => {
                  setPressedKey(key);
                  onKeyPress(key);
                  triggerRunningLights(key);
                }}
                onMouseUp={() => setPressedKey(null)}
                onMouseLeave={() => setPressedKey(null)}
                sx={getKeyStyle(key)}
              >
                {getKeyLabel(key)}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default Keyboard;