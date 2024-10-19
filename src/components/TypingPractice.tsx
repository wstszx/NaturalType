import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, Typography, Button, Container, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Grid, Select, MenuItem, FormControl, 
  InputLabel, Card, CardContent, LinearProgress, Fab, 
  useTheme, ThemeProvider, createTheme
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Keyboard, { LightEffect } from './Keyboard';
import { articles } from '../data/articles';
import { shuangpinSchemes, ShuangpinSchemeName } from '../data/shuangpinSchemes';
import { pinyin } from 'pinyin-pro';
import { SelectChangeEvent } from '@mui/material/Select';

// 检查字符是否为标点符号或非汉字的函数
const isPunctuationOrNonChinese = (char: string): boolean => {
  const regex = /[^\u4e00-\u9fa5]/;
  return regex.test(char);
};

// 新增：获取整篇文章拼音的函数
const getArticlePinyin = (text: string): string[] => {
  return pinyin(text, { toneType: 'none', type: 'array' });
};

// 修改：getShuangpinCode 函数现在接受预先计算的拼音
const getShuangpinCode = (char: string, pinyinStr: string, currentScheme: ShuangpinSchemeName): ShuangpinCode => {
  if (pinyinStr) {
    const firstVowelIndex = pinyinStr.search(/[aeiouv]/i);
    let shengmu = pinyinStr.slice(0, firstVowelIndex);
    let yunmu = pinyinStr.slice(firstVowelIndex);

    console.log(`Character: ${char}`);
    console.log(`Full Pinyin: ${pinyinStr}`);
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

    const currentSchemeData = shuangpinSchemes[currentScheme];
    const shengmuKey = Object.keys(currentSchemeData).find(key => currentSchemeData[key].shengmu === shengmu) || '';
    const yunmuKey = Object.keys(currentSchemeData).find(key => {
      const keyYunmu = currentSchemeData[key].yunmu;
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
  const [articlePinyin, setArticlePinyin] = useState<string[]>([]);
  const [currentScheme, setCurrentScheme] = useState<ShuangpinSchemeName>("微软双拼");
  const [lightEffect, setLightEffect] = useState<LightEffect>('rainbow');
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useTheme();
  const darkTheme = createTheme({
    ...theme,
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      background: {
        default: darkMode ? '#303030' : '#f5f5f5',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
  });

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

  // 修改：在文章加载时获取整篇文章的拼音
  useEffect(() => {
    const pinyinArray = getArticlePinyin(text);
    setArticlePinyin(pinyinArray);
    console.log('Article pinyin:', pinyinArray);
  }, [text]);

  // 修改：moveToNextCharacter 函数现在使用预先计算的拼音
  const moveToNextCharacter = useCallback(() => {
    let nextIndex = currentIndex + 1;
    let nextChar = text[nextIndex];

    // 跳过标点符号和非汉字字符
    while (nextIndex < text.length && isPunctuationOrNonChinese(nextChar)) {
      nextIndex++;
      nextChar = text[nextIndex];
    }

    if (nextIndex < text.length) {
      const nextPinyin = articlePinyin[nextIndex];
      const nextShuangpinCode = getShuangpinCode(nextChar, nextPinyin, currentScheme);
      
      console.log(`Moving to next character: ${nextChar}, Pinyin: ${nextPinyin}`);
      
      setCurrentIndex(nextIndex);
      setCurrentChar(nextChar);
      setCurrentShuangpinCode(nextShuangpinCode);
      setCurrentKeyIndex(0);
      setCurrentKey(nextShuangpinCode[0].toLowerCase());
      setTypedKeys([]);
      setProgress((nextIndex / text.length) * 100);
    } else {
      console.log('Reached end of text');
      setOpenDialog(true); // 打开弹窗
      setCurrentIndex(-1);
      setCurrentKeyIndex(0);
      setCurrentKey('');
      setTypedKeys([]);
    }
  }, [currentIndex, text, articlePinyin, currentScheme]);

  // 修改：handleNextArticle 函数需要重置 articlePinyin
  const handleNextArticle = () => {
    const nextIndex = (currentArticleIndex + 1) % articles.length;
    const nextText = articles[nextIndex].content;
    setCurrentArticleIndex(nextIndex);
    setText(nextText);
    setArticlePinyin(getArticlePinyin(nextText));
    setCurrentIndex(-1);
    setCurrentKeyIndex(0);
    setTypedKeys([]);
    setOpenDialog(false);
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
      const shuangpinCode = getShuangpinCode(currentChar, articlePinyin[currentIndex], currentScheme);
      console.log(`Shuangpin code for '${currentChar}': ${shuangpinCode[0]}, ${shuangpinCode[1]}`);
      setCurrentShuangpinCode(shuangpinCode);
      const newKey = currentKeyIndex === 0 ? shuangpinCode[0] : shuangpinCode[1];
      console.log(`Setting new current key: ${newKey}`);
      setCurrentKey(newKey.toLowerCase());
    }
  }, [currentChar, currentKeyIndex, articlePinyin, currentIndex, currentScheme]);

  useEffect(() => {
    renderCount.current += 1;
    console.log('Current char:', currentChar);
    console.log('Current Shuangpin code:', currentShuangpinCode);
    console.log('Current Key:', currentKey);
  });

  // 修改：初始化时也需要设置 articlePinyin
  useEffect(() => {
    const initialPinyin = getArticlePinyin(text);
    setArticlePinyin(initialPinyin);
    moveToNextCharacter();
  }, []);

  const handleSchemeChange = (event: SelectChangeEvent<ShuangpinSchemeName>) => {
    setCurrentScheme(event.target.value as ShuangpinSchemeName);
    // Reset current practice state
    setCurrentIndex(-1);
    setCurrentKeyIndex(0);
    setTypedKeys([]);
  };

  const handleLightEffectChange = (event: SelectChangeEvent<LightEffect>) => {
    setLightEffect(event.target.value as LightEffect);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s, color 0.3s'
      }}>
        <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            双拼练习系统
          </Typography>
          
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="scheme-select-label">双拼方案</InputLabel>
                <Select
                  labelId="scheme-select-label"
                  id="scheme-select"
                  value={currentScheme}
                  label="双拼方案"
                  onChange={handleSchemeChange}
                >
                  {Object.keys(shuangpinSchemes).map((schemeName) => (
                    <MenuItem key={schemeName} value={schemeName}>
                      {schemeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="light-effect-label">灯光效果</InputLabel>
                <Select
                  labelId="light-effect-label"
                  value={lightEffect}
                  label="灯光效果"
                  onChange={handleLightEffectChange}
                >
                  <MenuItem value="rainbow">彩虹</MenuItem>
                  <MenuItem value="pulse">脉冲</MenuItem>
                  <MenuItem value="wave">波浪</MenuItem>
                  <MenuItem value="static">静态</MenuItem>
                  <MenuItem value="neon">霓虹</MenuItem>
                  <MenuItem value="gradient">渐变</MenuItem>
                  <MenuItem value="firefly">萤火虫</MenuItem>
                  <MenuItem value="matrix">矩阵</MenuItem>
                  <MenuItem value="sparkle">闪烁</MenuItem>
                  <MenuItem value="cosmic">宇宙</MenuItem>
                  <MenuItem value="aurora">极光</MenuItem>
                  <MenuItem value="laser">激光</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Card elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              p: 2 // 减少内边距
            }}>
              <Box sx={{ mb: 0 }}> {/* 移除下边距 */}
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {articles[currentArticleIndex].title}
                </Typography>
                <Box sx={{ 
                  height: '25vh', // 保持高度不变
                  overflowY: 'auto',
                  mb: 0 // 移除下边距
                }}>
                  <Typography variant="body1" sx={{ textAlign: 'left', fontSize: '1.2rem' }}>
                    {text.split('').map((char, index) => (
                      <span key={index} style={{ 
                        color: index < currentIndex ? theme.palette.success.main : 
                               index === currentIndex ? theme.palette.primary.main : 
                               theme.palette.text.primary 
                      }}>
                        {char}
                      </span>
                    ))}
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.5, mb: 0.5 }} /> {/* 调整上下边距 */}
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Keyboard 
                  onKeyPress={handleKeyPress} 
                  currentKey={currentKey}
                  scheme={shuangpinSchemes[currentScheme]}
                  lightEffect={lightEffect}
                  schemeName={currentScheme} // 添加这一行
                />
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleNextArticle}>
              下一篇文章
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleOpenDonateDialog}>
              捐赠支持
            </Button>
          </Box>
        </Container>
        
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          <Fab size="small" color="primary" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </Fab>
        </Box>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"恭喜您完成本篇双拼练习！"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              您已经完成了当前文章的双拼输入。准备好挑战下一篇文章，进一步提升您的双拼技能了吗？
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
            {"支持双拼练习系统"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="donate-dialog-description">
              如果您得这个双拼练习工具对您的输入技能提升有帮助，可以考虑给我们一些支持。您可以通过以下方式进行捐赠：
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
    </ThemeProvider>
  );
};

export default TypingPractice;
