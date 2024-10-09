interface ShuangpinKey {
  shengmu?: string;
  yunmu?: string;
}

export const shuangpinMap: { [key: string]: { shengmu: string; yunmu: string } } = {
  // 这里应该包含所有的双拼映射
  // 例如：
  // '啊': 'aa',
  // '爱': 'ai',
  // ... 其他映射
  '中': { shengmu: 'zh', yunmu: 'ong' },
};

export const shuangpinData: { [key: string]: ShuangpinKey } = {
  'q': { shengmu: 'q', yunmu: 'iu' },
  'w': { shengmu: 'w', yunmu: 'ia' },
  'e': { shengmu: '', yunmu: 'e' },
  'r': { shengmu: 'r', yunmu: 'uan' },
  't': { shengmu: 't', yunmu: 'ue' },
  'y': { shengmu: 'y', yunmu: 'uai' },
  'u': { shengmu: 'sh', yunmu: 'u' },
  'i': { shengmu: 'ch', yunmu: 'i' },
  'o': { shengmu: '', yunmu: 'o' },
  'p': { shengmu: 'p', yunmu: 'un' },
  'a': { shengmu: '', yunmu: 'a' },
  's': { shengmu: 's', yunmu: 'ong' },
  'd': { shengmu: 'd', yunmu: 'uang' },
  'f': { shengmu: 'f', yunmu: 'en' },
  'g': { shengmu: 'g', yunmu: 'eng' },
  'h': { shengmu: 'h', yunmu: 'ang' },
  'j': { shengmu: 'j', yunmu: 'an' },
  'k': { shengmu: 'k', yunmu: 'ao' },
  'l': { shengmu: 'l', yunmu: 'ai' },
  'z': { shengmu: 'z', yunmu: 'ei' },
  'x': { shengmu: 'x', yunmu: 'ie' },
  'c': { shengmu: 'c', yunmu: 'iao' },
  'v': { shengmu: 'zh', yunmu: 'ui' },
  'b': { shengmu: 'b', yunmu: 'ou' },
  'n': { shengmu: 'n', yunmu: 'in' },
  'm': { shengmu: 'm', yunmu: 'ian' },
};