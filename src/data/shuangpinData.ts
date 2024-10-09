interface ShuangpinKey {
  shengmu?: string;
  yunmu?: string | string[];
}

export const shuangpinData: { [key: string]: ShuangpinKey } = {
  'q': { shengmu: 'q', yunmu: 'iu' },
  'w': { shengmu: 'w', yunmu: ['ia', 'ua'] },
  'e': { shengmu: '', yunmu: 'e' },
  'r': { shengmu: 'r', yunmu: 'uan' },
  't': { shengmu: 't', yunmu: ['ue', 've'] },
  'y': { shengmu: 'y', yunmu: ['ing', 'uai'] },
  'u': { shengmu: 'sh', yunmu: 'u' },
  'i': { shengmu: 'ch', yunmu: 'i' },
  'o': { shengmu: '', yunmu: ['o', 'uo'] },
  'p': { shengmu: 'p', yunmu: 'un' },
  'a': { shengmu: '', yunmu: 'a' },
  's': { shengmu: 's', yunmu: ['iong', 'ong'] },
  'd': { shengmu: 'd', yunmu: ['iang', 'uang'] },
  'f': { shengmu: 'f', yunmu: 'en' },
  'g': { shengmu: 'g', yunmu: 'eng' },
  'h': { shengmu: 'h', yunmu: 'ang' },
  'j': { shengmu: 'j', yunmu: 'an' },
  'k': { shengmu: 'k', yunmu: 'ao' },
  'l': { shengmu: 'l', yunmu: 'ai' },
  ';': { shengmu: '', yunmu: '' },
  'z': { shengmu: 'z', yunmu: 'ei' },
  'x': { shengmu: 'x', yunmu: 'ie' },
  'c': { shengmu: 'c', yunmu: 'iao' },
  'v': { shengmu: 'zh', yunmu: ['ui', 'v'] },
  'b': { shengmu: 'b', yunmu: 'ou' },
  'n': { shengmu: 'n', yunmu: 'in' },
  'm': { shengmu: 'm', yunmu: 'ian' },
};