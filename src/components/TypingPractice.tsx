import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Keyboard from './Keyboard';

const TypingPractice: React.FC = () => {
  console.log('TypingPractice component function called');

  const [text, setText] = useState<string>('Hello, world!'); // 示例文本
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<string>(text[0]);
  const renderCount = useRef(0);

  const handleKeyPress = useCallback((key: string) => {
    console.log('handleKeyPress called with key:', key);
    if (key.toLowerCase() === text[currentIndex].toLowerCase()) {
      if (currentIndex < text.length - 1) {
        setCurrentIndex(prevIndex => {
          console.log('Updating currentIndex from', prevIndex, 'to', prevIndex + 1);
          return prevIndex + 1;
        });
      } else {
        console.log('练习完成！重置 currentIndex');
        setCurrentIndex(0);
      }
    }
  }, [currentIndex, text]);

  useEffect(() => {
    console.log('Effect: updating currentKey. currentIndex:', currentIndex);
    setCurrentKey(text[currentIndex]);
  }, [currentIndex, text]);

  useEffect(() => {
    renderCount.current += 1;
    console.log('Render count:', renderCount.current);
  });

  console.log('Rendering TypingPractice. currentIndex:', currentIndex, 'currentKey:', currentKey);

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        打字练习
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
        {text.split('').map((char, index) => (
          <span key={index} style={{ color: index < currentIndex ? 'green' : index === currentIndex ? 'blue' : 'black' }}>
            {char}
          </span>
        ))}
      </Typography>
      <Keyboard onKeyPress={handleKeyPress} currentKey={currentKey} />
    </Box>
  );
};

export default TypingPractice;