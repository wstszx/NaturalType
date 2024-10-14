import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material';
import Keyboard from './Keyboard';
import { articles } from '../data/articles';
import { shuangpinData } from '../data/shuangpinData';
import { pinyin } from 'pinyin-pro';

// 检查字符是否为标点符号或非汉字的函数
const isPunctuationOrNonChinese = (char: string): boolean => {
  const regex = /[^\u4e00-\u9fa5]/;
  return regex.test(char);
};

// 修改获取汉字的双拼编码函数
const getShuangpinCode = (char: string): ShuangpinCode => {
  const pinyinResult = pinyin(char, { toneType: 'none', type: 'array' })[0];
  if (pinyinResult) {
    const firstVowelIndex = pinyinResult.search(/[aeiouv]/i);
    let shengmu = pinyinResult.slice(0, firstVowelIndex);
    let yunmu = pinyinResult.slice(firstVowelIndex);

    console.log(`Character: ${char}`);
    console.log(`Full Pinyin: ${pinyinResult}`);
    console.log(`Initial Shengmu: ${shengmu || '(zero initial)'}`);
    console.log(`Initial Yunmu: ${yunmu}`);

    // 处理特殊韵母
    if (yunmu === 'ue') yunmu = 've';

    // 处理零声母情况
    if (shengmu === '' && ['a', 'e', 'i', 'o', 'u'].includes(yunmu[0])) {
      shengmu = yunmu[0];
      yunmu = yunmu.slice(1);
      console.log(`Zero initial case - Updated Shengmu: ${shengmu}, Updated Yunmu: ${yunmu}`);
    }

    // 处理单韵母情况（如"啊"、"饿"、"哦"等）
    if (shengmu === '' && yunmu.length === 1) {
      shengmu = yunmu;
      yunmu = 'iuv'.includes(yunmu) ? 'i' : yunmu;
      console.log(`Single vowel case - Updated Shengmu: ${shengmu}, Updated Yunmu: ${yunmu}`);
    }

    const shengmuKey = Object.keys(shuangpinData).find(key => shuangpinData[key].shengmu === shengmu) || '';
    const yunmuKey = Object.keys(shuangpinData).find(key => {
      const keyYunmu = shuangpinData[key].yunmu;
      return Array.isArray(keyYunmu) ? keyYunmu.includes(yunmu) : keyYunmu === yunmu;
    }) || '';

    console.log(`Final Shuangpin code: Shengmu Key: ${shengmuKey}, Yunmu Key: ${yunmuKey}`);

    return [shengmuKey, yunmuKey] as ShuangpinCode;
  }
  console.warn(`No Shuangpin code found for character: ${char}`);
  return ['', ''] as ShuangpinCode;
};

type ShuangpinCode = [string, string];

const TypingPractice: React.FC = () => {
  const [currentArticleIndex, setCurrentArticleIndex] = useState<number>(0);
  const [text, setText] = useState<string>(articles[0].content);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);  // 将初始值设为 -1
  const [currentChar, setCurrentChar] = useState<string>('');
  const [currentShuangpinCode, setCurrentShuangpinCode] = useState<ShuangpinCode>(['', '']);
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [currentKey, setCurrentKey] = useState<string>('');
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const renderCount = useRef(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDonateDialog, setOpenDonateDialog] = useState(false);

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
  }, [currentKey, currentShuangpinCode, typedKeys]);

  const moveToNextCharacter = useCallback(() => {
    let nextIndex = currentIndex + 1;
    let nextChar = text[nextIndex];

    // 跳过标点符号和非汉字字符
    while (nextIndex < text.length && isPunctuationOrNonChinese(nextChar)) {
      nextIndex++;
      nextChar = text[nextIndex];
    }

    if (nextIndex < text.length) {
      const nextShuangpinCode = getShuangpinCode(nextChar);
      
      console.log(`Moving to next character: ${nextChar}`);
      // getShuangpinCode 函数中的日志会打印出详细的拼音构成信息
      
      setCurrentIndex(nextIndex);
      setCurrentChar(nextChar);
      setCurrentShuangpinCode(nextShuangpinCode);
      setCurrentKeyIndex(0);
      setCurrentKey(nextShuangpinCode[0].toLowerCase());
      setTypedKeys([]);
    } else {
      console.log('Reached end of text');
      setOpenDialog(true); // 打开弹窗
      setCurrentIndex(-1);
      setCurrentKeyIndex(0);
      setCurrentKey('');
      setTypedKeys([]);
    }
  }, [currentIndex, text]);

  const handleNextArticle = () => {
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    setCurrentArticleIndex(nextIndex);
    setText(articles[nextIndex].content);
    setCurrentIndex(-1);
    setCurrentKeyIndex(0);
    setTypedKeys([]);
    setOpenDialog(false); // 关闭弹窗
  };

  const handleOpenDonateDialog = () => {
    setOpenDonateDialog(true);
  };

  const handleCloseDonateDialog = () => {
    setOpenDonateDialog(false);
  };

  useEffect(() => {
    if (currentIndex === -1) {
      moveToNextCharacter();
    }
  }, [currentIndex, moveToNextCharacter]);

  useEffect(() => {
    if (currentChar) {
      const shuangpinCode = getShuangpinCode(currentChar);
      console.log(`Shuangpin code for '${currentChar}': ${shuangpinCode[0]}, ${shuangpinCode[1]}`);
      setCurrentShuangpinCode(shuangpinCode);
      const newKey = currentKeyIndex === 0 ? shuangpinCode[0] : shuangpinCode[1];
      console.log(`Setting new current key: ${newKey}`);
      setCurrentKey(newKey.toLowerCase());
    }
  }, [currentChar, currentKeyIndex]);

  useEffect(() => {
    renderCount.current += 1;
    console.log('Current char:', currentChar);
    console.log('Current Shuangpin code:', currentShuangpinCode);
    console.log('Current Key:', currentKey);
  });

  // 初始化
  useEffect(() => {
    moveToNextCharacter();
  }, []);

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
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleNextArticle} sx={{ mr: 2 }}>
              下一篇文章
            </Button>
            <Button variant="outlined" onClick={handleOpenDonateDialog}>
              捐赠支持
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"恭喜您完成输入！"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            您已经完成了当前文章的输入。准备好挑战下一篇文章了吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNextArticle} autoFocus>
            确认
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDonateDialog}
        onClose={handleCloseDonateDialog}
        aria-labelledby="donate-dialog-title"
        aria-describedby="donate-dialog-description"
      >
        <DialogTitle id="donate-dialog-title">
          {"感谢您的支持！"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="donate-dialog-description">
            如果您觉得这个工具对您有帮助，可以考虑给我们一些支持。您可以通过以下方式进行捐赠：
          </DialogContentText>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>微信支付</Typography>
              <img src="/images/wechat_qr.png" alt="微信收款码" style={{ width: '100%', maxWidth: 200 }} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" gutterBottom>支付宝</Typography>
              <img src="/images/alipay_qr.png" alt="支付宝收款码" style={{ width: '100%', maxWidth: 200 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDonateDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TypingPractice;
