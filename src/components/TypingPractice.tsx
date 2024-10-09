import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Keyboard from './Keyboard';
import { articles } from '../data/articles';
import { shuangpinData } from '../data/shuangpinData';
import { pinyin } from 'pinyin-pro';

// 修改获取汉字的双拼编码函数
const getShuangpinCode = (char: string): ShuangpinCode => {
  const pinyinResult = pinyin(char, { toneType: 'none', type: 'array' })[0];
  if (pinyinResult) {
    let shengmu = pinyinResult.slice(0, pinyinResult.indexOf(pinyinResult.match(/[aeiouv]/i)![0]));
    let yunmu = pinyinResult.slice(pinyinResult.indexOf(pinyinResult.match(/[aeiouv]/i)![0]));

    // 处理特殊情况
    if (yunmu === 'ue') yunmu = 've';
    if (shengmu === '' && ['a', 'e', 'i', 'o', 'u'].includes(yunmu[0])) {
      shengmu = yunmu[0];
      yunmu = yunmu.slice(1);
    }

    const shengmuKey = Object.keys(shuangpinData).find(key => shuangpinData[key].shengmu === shengmu) || '';
    const yunmuKey = Object.keys(shuangpinData).find(key => {
      const keyYunmu = shuangpinData[key].yunmu;
      return Array.isArray(keyYunmu) ? keyYunmu.includes(yunmu) : keyYunmu === yunmu;
    }) || '';

    return [shengmuKey, yunmuKey] as ShuangpinCode;
  }
  console.warn(`No Shuangpin code found for character: ${char}`);
  return ['', ''] as ShuangpinCode;
};

type ShuangpinCode = [string, string];

const TypingPractice: React.FC = () => {
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);
  const [text, setText] = useState<string>(articles[0].content);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<string>(text[0]);
  const [currentShuangpinCode, setCurrentShuangpinCode] = useState<ShuangpinCode>(['', '']);
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<string>('');
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const renderCount = useRef(0);

  const handleKeyPress = useCallback((key: string) => {
    const lowerCaseKey = key.toLowerCase();
    const expectedKey = currentKey.toLowerCase();

    console.log(`Key pressed: ${lowerCaseKey}, Expected key: ${expectedKey}`);

    if (lowerCaseKey !== expectedKey) {
      console.log('Incorrect key pressed');
      return;
    }

    const newTypedKeys = [...typedKeys, lowerCaseKey];
    setTypedKeys(newTypedKeys);

    if (newTypedKeys.length === 2) {
      moveToNextCharacter();
    } else {
      setCurrentKeyIndex(1);
      setCurrentKey(currentShuangpinCode[1].toLowerCase());
    }
  }, [currentIndex, currentKey, currentShuangpinCode, text, typedKeys]);

  const moveToNextCharacter = useCallback(() => {
    if (currentIndex < text.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextChar = text[nextIndex];
      const nextShuangpinCode = getShuangpinCode(nextChar);
      
      console.log(`Moving to next character: ${nextChar}, Shuangpin: ${nextShuangpinCode.join(', ')}`);
      
      setCurrentIndex(nextIndex);
      setCurrentChar(nextChar);
      setCurrentShuangpinCode(nextShuangpinCode);
      setCurrentKeyIndex(0);
      setCurrentKey(nextShuangpinCode[0].toLowerCase());
      setTypedKeys([]);
    } else {
      console.log('Reached end of text');
      // 可以在这里添加完成练习的逻辑
      setCurrentIndex(0);
      setCurrentKeyIndex(0);
      setCurrentKey('');
      setTypedKeys([]);
    }
  }, [currentIndex, text]);

  const handleNextArticle = () => {
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    setCurrentArticleIndex(nextIndex);
    setText(articles[nextIndex].content);
    setCurrentIndex(0);
    setCurrentKeyIndex(0);
  };

  useEffect(() => {
    console.log(`Current char updated: ${text[currentIndex]}`);
    setCurrentChar(text[currentIndex]);
  }, [currentIndex, text]);

  useEffect(() => {
    const shuangpinCode = getShuangpinCode(currentChar);
    console.log(`Shuangpin code for '${currentChar}': ${shuangpinCode[0]}, ${shuangpinCode[1]}`);
    setCurrentShuangpinCode(shuangpinCode);
    const newKey = currentKeyIndex === 0 ? shuangpinCode[0] : shuangpinCode[1];
    console.log(`Setting new current key: ${newKey}`);
    setCurrentKey(newKey.toLowerCase());
  }, [currentChar, currentKeyIndex]);

  useEffect(() => {
    renderCount.current += 1;
    console.log('Current char:', currentChar);
    console.log('Current Shuangpin code:', currentShuangpinCode);
    console.log('Current Key:', currentKey);
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
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <Box sx={{ mb: 2, height: 150, overflowY: 'auto' }}>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: 'left' }}>
              {text.split('').map((char, index) => (
                <span key={index} style={{ color: index < currentIndex ? 'green' : index === currentIndex ? 'blue' : 'black' }}>
                  {char}
                </span>
              ))}
            </Typography>
          </Box>
          <Keyboard 
            onKeyPress={handleKeyPress} 
            currentKey={currentKey} 
          />
          <Button variant="contained" onClick={handleNextArticle} sx={{ mt: 2 }}>
            下一篇文章
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TypingPractice;