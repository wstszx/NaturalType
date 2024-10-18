import { shuangpinData } from '../data/shuangpinData';

// Define ShuangpinKey type locally if it's not exported from shuangpinData
type ShuangpinKey = Record<string, string>;

export function getNextKeyForShuangpin(char: string): string {
  const pinyin = (shuangpinData.pinyinMap as Record<string, string>)[char];
  if (!pinyin) return '';

  const [initial, final] = pinyin.split(' ');
  const initialKey = (shuangpinData.initialMap as ShuangpinKey)[initial] || initial;
  const finalKey = (shuangpinData.finalMap as ShuangpinKey)[final] || final;

  // 如果是声母，返回声母对应的键
  if (initialKey !== final) return initialKey;
  
  // 如果只有韵母，或者是第二次按键，返回韵母对应的键
  return finalKey;
}
