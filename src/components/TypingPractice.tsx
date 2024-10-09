import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Keyboard from './Keyboard';
import { articles } from '../data/articles';

const TypingPractice: React.FC = () => {
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);
  const [text, setText] = useState<string>(articles[0].content);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<string>(text[0]);
  const renderCount = useRef(0);

  const handleKeyPress = useCallback((key: string) => {
    if (key.toLowerCase() === text[currentIndex].toLowerCase()) {
      if (currentIndex < text.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  }, [currentIndex, text]);

  const handleNextArticle = () => {
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    setCurrentArticleIndex(nextIndex);
    setText(articles[nextIndex].content);
    setCurrentIndex(0);
  };

  useEffect(() => {
    setCurrentKey(text[currentIndex]);
  }, [currentIndex, text]);

  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        打字练习
      </Typography>
      <Typography variant="h6" gutterBottom>
        {articles[currentArticleIndex].title}
      </Typography>
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 800 }}>  {/* 调整这个宽度以匹配键盘容器 */}
          <Box sx={{ mb: 2, height: 150, overflowY: 'auto' }}>  {/* 添加固定高度和滚动 */}
            <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: 'left' }}>
              {text.split('').map((char, index) => (
                <span key={index} style={{ color: index < currentIndex ? 'green' : index === currentIndex ? 'blue' : 'black' }}>
                  {char}
                </span>
              ))}
            </Typography>
          </Box>
          <Keyboard onKeyPress={handleKeyPress} currentKey={currentKey} />
          <Button variant="contained" onClick={handleNextArticle} sx={{ mt: 2 }}>
            下一篇文章
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TypingPractice;