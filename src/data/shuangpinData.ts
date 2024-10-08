interface ShuangpinMapping {
  [key: string]: string;
}

export const shuangpinScheme: ShuangpinMapping = {
  'a': 'a', 'ai': 'l', 'an': 'j', 'ang': 'h', 'ao': 'k',
  'b': 'b', 'c': 'c', 'ch': 'i', 'd': 'd', 'e': 'e',
  'ei': 'z', 'en': 'f', 'eng': 'g', 'f': 'f', 'g': 'g',
  'h': 'h', 'i': 'i', 'in': 'n', 'ing': ';', 'j': 'j',
  'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
  'ong': 's', 'ou': 'b', 'p': 'p', 'q': 'q', 'r': 'r',
  's': 's', 'sh': 'u', 't': 't', 'u': 'u', 'v': 'v',
  'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z', 'zh': 'v'
};

export const articles = [
  {
    text: "双拼输入法是一种汉字输入法，它使用两个字母来表示一个汉字的拼音。",
    shuangpin: "ul pf ur fa u yi zn hj zi ur fa ta u yn lq ge zi mu ll bk u yi ge hj zi de pf yf"
  },
  {
    text: "计算机科学是研究信息与计算的理论基础以及它们在计算机系统中如何实现与应用的学科。",
    shuangpin: "ji uj ji ke xr u yj jb xf xi yu ji uj de li lj ji ib yi ji ta mf zl ji uj ji xi tn zn rb he u xj yu yg yn de xr ke"
  },
  {
    text: "人工智能是计算机科学的一个分支，它致力于创造智能机器。",
    shuangpin: "rf gn zi nf u ji uj ji ke xr de yi ge ff zi ta zi li yu ij zk zi nf ji qi"
  }
];