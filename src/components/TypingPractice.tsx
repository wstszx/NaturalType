import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Keyboard from './Keyboard';
import { articles, shuangpinScheme } from '../data/shuangpinData';

const TypingPractice: React.FC = () => {
  const [currentArticle, setCurrentArticle] = useState({ text: '', shuangpin: '' });
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentShuangpinIndex, setCurrentShuangpinIndex] = useState(0);
  const [typedShuangpin, setTypedShuangpin] = useState('');
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);

  useEffect(() => {
    selectRandomArticle();
  }, []);

  const selectRandomArticle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * articles.length);
    setCurrentArticle(articles[randomIndex]);
    setCurrentCharIndex(0);
    setCurrentShuangpinIndex(0);
    setTypedShuangpin('');
    updateHighlightedKeys(articles[randomIndex].shuangpin.split(' ')[0]);
  }, []);

  const updateHighlightedKeys = (currentShuangpin: string) => {
    const keys = currentShuangpin.split('');
    setHighlightedKeys(keys);
  };

  const handleKeyPress = useCallback((key: string) => {
    const currentShuangpin = currentArticle.shuangpin.split(' ')[currentShuangpinIndex];
    if (key.toLowerCase() === currentShuangpin[typedShuangpin.length]) {
      const newTypedShuangpin = typedShuangpin + key.toLowerCase();
      setTypedShuangpin(newTypedShuangpin);

      if (newTypedShuangpin === currentShuangpin) {
        // Move to the next character
        const nextCharIndex = currentCharIndex + 1;
        const nextShuangpinIndex = currentShuangpinIndex + 1;
        setCurrentCharIndex(nextCharIndex);
        setCurrentShuangpinIndex(nextShuangpinIndex);
        setTypedShuangpin('');

        if (nextCharIndex === currentArticle.text.length) {
          // Article completed, select a new one
          selectRandomArticle();
        } else {
          updateHighlightedKeys(currentArticle.shuangpin.split(' ')[nextShuangpinIndex]);
        }
      }
    }
  }, [currentArticle, currentCharIndex, currentShuangpinIndex, typedShuangpin, selectRandomArticle]);

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2, backgroundColor: '#F3EDF7' }}>
        <Typography variant="h6" gutterBottom>
          Type the following text using Shuangpin:
        </Typography>
        <Typography variant="body1">
          {currentArticle.text.split('').map((char, index) => (
            <span
              key={index}
              style={{
                color: index < currentCharIndex ? 'green' : 'black',
                backgroundColor: index === currentCharIndex ? '#E8DEF8' : 'transparent',
                padding: '0 2px',
              }}
            >
              {char}
            </span>
          ))}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Current Shuangpin: {currentArticle.shuangpin.split(' ')[currentShuangpinIndex]}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Typed Shuangpin: {typedShuangpin}
        </Typography>
      </Paper>
      <Keyboard onKeyPress={handleKeyPress} highlightedKeys={highlightedKeys} />
    </Box>
  );
};

export default TypingPractice;