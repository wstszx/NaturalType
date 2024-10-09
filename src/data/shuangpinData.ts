interface ShuangpinKey {
  shengmu?: string;
  yunmu?: string | string[];
}

export const shuangpinData: { [key: string]: ShuangpinKey } = {
  'q': { shengmu: 'q', yunmu: 'iu' },
  'w': { shengmu: 'w', yunmu: 'ia' },
  'e': { shengmu: '', yunmu: ['e', 'ue'] },
  'r': { shengmu: 'r', yunmu: 'uan' },
  't': { shengmu: 't', yunmu: 've' },
  'y': { shengmu: 'y', yunmu: 'uai' },
  'u': { shengmu: 'sh', yunmu: ['u', 'un'] },
  'i': { shengmu: 'ch', yunmu: ['i', 'in', 'ing'] },
  'o': { shengmu: '', yunmu: ['o', 'uo'] },
  'p': { shengmu: 'p', yunmu: 'un' },
  'a': { shengmu: '', yunmu: ['a', 'ia'] },
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
  'v': { shengmu: 'zh', yunmu: ['ui', 'v'] },
  'b': { shengmu: 'b', yunmu: 'ou' },
  'n': { shengmu: 'n', yunmu: ['in', 'v'] },
  'm': { shengmu: 'm', yunmu: 'ian' },
};