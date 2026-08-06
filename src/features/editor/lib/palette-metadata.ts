import { type LatexEnvironment } from "@/features/editor/lib/insert-latex";
import { type LatexSymbol, type SymbolGroup } from "@/features/editor/types/editor";
import { categoryLabel, type Locale } from "@/lib/i18n";

export type LocalizedLabel = Record<Locale, string>;

function labels(zhCN: string, zhTW: string, en: string, ja: string): LocalizedLabel {
  return { "zh-CN": zhCN, "zh-TW": zhTW, en, ja };
}

export function localizeLabel(label: LocalizedLabel | undefined, locale: Locale): string {
  return label?.[locale] ?? "";
}

export function bilingualGroupLabel(name: string, englishName?: string): LocalizedLabel {
  const englishStart = name.search(/[A-Za-z]/);
  const chinese = (englishStart >= 0 ? name.slice(0, englishStart) : name).trim();
  const english = (englishName ?? (englishStart >= 0 ? name.slice(englishStart) : name)).trim();
  return labels(chinese || english, chinese || english, english || chinese, english || chinese);
}

const commonSymbolOrder = [
  "plus", "minus", "times", "div", "pm", "mp", "cdot", "ast", "star", "bullet", "circ",
  "cup", "cap", "setminus", "sqcup", "sqcap", "uplus", "amalg",
  "vee", "wedge", "oplus", "ominus", "odot", "oslash", "otimes", "bigcirc",
  "diamonda", "bigtriangleup", "bigtriangledown", "triangleleft", "triangleright",
  "lhd", "rhd", "unlhd", "unrhd", "wr", "dagger", "ddagger",
];

const greekAlphabetOrder = [
  "alpha", "beta", "gamma", "delta", "epsilon", "varepsilon", "zeta", "eta", "theta", "vartheta",
  "iota", "kappa", "lambda", "mu", "nu", "xi", "o", "pi", "varpi", "rho", "varrho", "sigma",
  "varsigma", "tau", "upsilon", "phi", "varphi", "chi", "psi", "omega",
  "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Upsilon", "Phi", "Psi", "Omega",
];

const categoryOrders: Record<string, string[]> = {
  symbol: commonSymbolOrder,
  greek: greekAlphabetOrder,
};

export function sortPaletteSymbols(category: string, symbols: LatexSymbol[]): LatexSymbol[] {
  const order = categoryOrders[category];
  if (!order) return symbols;
  const priorities = new Map(order.map((tag, index) => [tag, index]));
  return symbols
    .map((symbol, index) => ({ symbol, index }))
    .sort((left, right) => {
      const leftPriority = priorities.get(left.symbol.tag) ?? Number.MAX_SAFE_INTEGER;
      const rightPriority = priorities.get(right.symbol.tag) ?? Number.MAX_SAFE_INTEGER;
      return leftPriority - rightPriority || left.index - right.index;
    })
    .map(({ symbol }) => symbol);
}

interface TemplateGroupSpec {
  title: LocalizedLabel;
  tags: string[];
}

const range = (prefix: string, start: number, end: number): string[] =>
  Array.from({ length: end - start + 1 }, (_, index) => `${prefix}_${start + index}`);

const templateGroupSpecs: Record<string, TemplateGroupSpec[]> = {
  algebra: [
    { title: labels("基础恒等式", "基礎恆等式", "Basic identities", "基本恒等式"), tags: range("algebra", 1, 10) },
    { title: labels("多项式方程", "多項式方程", "Polynomial equations", "多項式方程式"), tags: range("algebra", 11, 13) },
  ],
  geometry: [
    { title: labels("直线与平面", "直線與平面", "Lines and planes", "直線と平面"), tags: range("geometry", 1, 10) },
    { title: labels("三角形", "三角形", "Triangles", "三角形"), tags: ["geometry_11"] },
  ],
  inequality: [
    { title: labels("序关系", "序關係", "Order relations", "順序関係"), tags: range("inequality", 1, 4) },
    { title: labels("绝对值", "絕對值", "Absolute values", "絶対値"), tags: range("inequality", 5, 8) },
    { title: labels("经典不等式", "經典不等式", "Classical inequalities", "古典不等式"), tags: range("inequality", 9, 13) },
  ],
  calculous: [
    { title: labels("导数", "導數", "Derivatives", "微分"), tags: [...range("calculous", 1, 5), "calculous_7", "calculous_8"] },
    { title: labels("积分", "積分", "Integrals", "積分"), tags: ["calculous_6", ...range("calculous", 9, 14)] },
  ],
  array: [
    { title: labels("基础矩阵", "基礎矩陣", "Basic matrices", "基本行列"), tags: range("array", 1, 4) },
    { title: labels("矩阵运算", "矩陣運算", "Matrix operations", "行列演算"), tags: range("array", 5, 8) },
  ],
  trigonometry: [
    { title: labels("基础形式", "基礎形式", "Basic forms", "基本形"), tags: range("trigonometry", 1, 2) },
    { title: labels("半角公式", "半角公式", "Half-angle identities", "半角公式"), tags: range("trigonometry", 3, 5) },
    { title: labels("和差与三角形", "和差與三角形", "Sum, difference, and triangles", "和差と三角形"), tags: range("trigonometry", 6, 13) },
  ],
  statistics: [
    { title: labels("排列组合", "排列組合", "Counting", "場合の数"), tags: range("statistics", 1, 2) },
    { title: labels("描述统计", "描述統計", "Descriptive statistics", "記述統計"), tags: range("statistics", 3, 7) },
    { title: labels("概率", "機率", "Probability", "確率"), tags: range("statistics", 8, 16) },
  ],
  sequence: [
    { title: labels("常用数列", "常用數列", "Common sequences", "数列の基本"), tags: range("sequence", 1, 4) },
    { title: labels("裂项与恒等式", "裂項與恆等式", "Telescoping and identities", "部分分数と恒等式"), tags: range("sequence", 5, 10) },
  ],
  physics: [
    { title: labels("力学", "力學", "Mechanics", "力学"), tags: range("physics", 1, 8) },
    { title: labels("电磁学", "電磁學", "Electromagnetism", "電磁気学"), tags: range("physics", 9, 14) },
    { title: labels("波与近代物理", "波與近代物理", "Waves and modern physics", "波動と現代物理"), tags: range("physics", 15, 20) },
    { title: labels("麦克斯韦方程组", "馬克士威方程組", "Maxwell equations", "マクスウェル方程式"), tags: range("physics", 21, 24) },
  ],
  chemistry: [
    { title: labels("化学反应式", "化學反應式", "Chemical equations", "化学反応式"), tags: range("chemistry", 1, 4) },
  ],
};

export function groupTemplateSymbols(category: string, symbols: LatexSymbol[]): SymbolGroup[] {
  const specs = templateGroupSpecs[category];
  if (!specs) return [{ symbols }];

  const byTag = new Map(symbols.map((symbol) => [symbol.tag, symbol]));
  const grouped = specs.flatMap((spec) => {
    const items = spec.tags.flatMap((tag) => {
      const symbol = byTag.get(tag);
      if (!symbol) return [];
      byTag.delete(tag);
      return [symbol];
    });
    return items.length ? [{ title: spec.title, symbols: items }] : [];
  });
  const remaining = symbols.filter((symbol) => byTag.has(symbol.tag));
  return remaining.length ? [...grouped, { symbols: remaining }] : grouped;
}

const greekNames: Record<string, LocalizedLabel> = {
  alpha: labels("阿尔法", "阿爾法", "Alpha", "アルファ"),
  beta: labels("贝塔", "貝塔", "Beta", "ベータ"),
  gamma: labels("伽马", "伽馬", "Gamma", "ガンマ"),
  delta: labels("德尔塔", "德爾塔", "Delta", "デルタ"),
  epsilon: labels("艾普西隆", "艾普西隆", "Epsilon", "イプシロン"),
  varepsilon: labels("变体艾普西隆", "變體艾普西隆", "Variant epsilon", "変体イプシロン"),
  zeta: labels("泽塔", "澤塔", "Zeta", "ゼータ"),
  eta: labels("伊塔", "伊塔", "Eta", "イータ"),
  theta: labels("西塔", "西塔", "Theta", "シータ"),
  vartheta: labels("变体西塔", "變體西塔", "Variant theta", "変体シータ"),
  iota: labels("约塔", "約塔", "Iota", "イオタ"),
  kappa: labels("卡帕", "卡帕", "Kappa", "カッパ"),
  lambda: labels("拉姆达", "拉姆達", "Lambda", "ラムダ"),
  mu: labels("缪", "繆", "Mu", "ミュー"),
  nu: labels("纽", "紐", "Nu", "ニュー"),
  xi: labels("克西", "克西", "Xi", "クサイ"),
  o: labels("奥密克戎", "奧密克戎", "Omicron", "オミクロン"),
  pi: labels("派", "派", "Pi", "パイ"),
  varpi: labels("变体派", "變體派", "Variant pi", "変体パイ"),
  rho: labels("柔", "柔", "Rho", "ロー"),
  varrho: labels("变体柔", "變體柔", "Variant rho", "変体ロー"),
  sigma: labels("西格玛", "西格瑪", "Sigma", "シグマ"),
  varsigma: labels("变体西格玛", "變體西格瑪", "Variant sigma", "変体シグマ"),
  tau: labels("陶", "陶", "Tau", "タウ"),
  upsilon: labels("宇普西隆", "宇普西隆", "Upsilon", "ウプシロン"),
  phi: labels("斐", "斐", "Phi", "ファイ"),
  varphi: labels("变体斐", "變體斐", "Variant phi", "変体ファイ"),
  chi: labels("希", "希", "Chi", "カイ"),
  psi: labels("普西", "普西", "Psi", "プサイ"),
  omega: labels("欧米伽", "歐米伽", "Omega", "オメガ"),
};

for (const tag of ["Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Upsilon", "Phi", "Psi", "Omega"]) {
  const lowercase = greekNames[tag.toLowerCase()];
  if (lowercase) {
    greekNames[tag] = labels(`大写${lowercase["zh-CN"]}`, `大寫${lowercase["zh-TW"]}`, `Uppercase ${tag}`, `大文字${lowercase.ja}`);
  }
}

const matrixNames: Record<string, LocalizedLabel> = {
  matrix: labels("无边框矩阵", "無邊框矩陣", "Plain matrix", "枠なし行列"),
  bmatrix: labels("方括号矩阵", "方括號矩陣", "Bracketed matrix", "角括弧行列"),
  pmatrix: labels("圆括号矩阵", "圓括號矩陣", "Parenthesized matrix", "丸括弧行列"),
  vmatrix: labels("行列式", "行列式", "Determinant", "行列式"),
  bigVmatrix: labels("范数矩阵", "範數矩陣", "Norm matrix", "ノルム行列"),
  bigBmatrix: labels("花括号矩阵", "花括號矩陣", "Braced matrix", "波括弧行列"),
  leftmatrix: labels("左花括号矩阵", "左花括號矩陣", "Left-braced matrix", "左波括弧行列"),
  rightmatrix: labels("右花括号矩阵", "右花括號矩陣", "Right-braced matrix", "右波括弧行列"),
  case: labels("分段函数", "分段函數", "Cases", "場合分け"),
  align: labels("多行对齐公式", "多行對齊公式", "Aligned equations", "複数行の整列式"),
};

const controlNames: Record<string, LocalizedLabel> = {
  Blue: labels("蓝色", "藍色", "Blue", "青"), Brown: labels("棕色", "棕色", "Brown", "茶色"),
  Gray: labels("灰色", "灰色", "Gray", "灰色"), Green: labels("绿色", "綠色", "Green", "緑"),
  Orange: labels("橙色", "橙色", "Orange", "オレンジ"), Peach: labels("桃色", "桃色", "Peach", "桃色"),
  Purple: labels("紫色", "紫色", "Purple", "紫"), Red: labels("红色", "紅色", "Red", "赤"),
  Tan: labels("黄褐色", "黃褐色", "Tan", "黄褐色"), Violet: labels("紫罗兰色", "紫羅蘭色", "Violet", "すみれ色"),
  Yellow: labels("黄色", "黃色", "Yellow", "黄"), userdefime: labels("自定义 RGB", "自訂 RGB", "Custom RGB", "カスタム RGB"),
  font1: labels("罗马体", "羅馬體", "Roman typeface", "ローマン体"), font2: labels("粗体", "粗體", "Boldface", "太字"),
  font3: labels("斜体", "斜體", "Italic", "斜体"), font4: labels("下划线", "底線", "Underline", "下線"),
  font5: labels("无衬线体", "無襯線體", "Sans serif", "サンセリフ体"), font6: labels("黑板粗体", "黑板粗體", "Blackboard bold", "黒板太字"),
  font7: labels("书法体", "書法體", "Calligraphic", "カリグラフィ体"), font8: labels("哥特体", "哥德體", "Fraktur", "フラクトゥール体"),
  size1: labels("极小", "極小", "Tiny", "極小"), size2: labels("脚注大小", "腳註大小", "Script size", "スクリプトサイズ"),
  size3: labels("小号", "小號", "Small", "小"), size4: labels("标准", "標準", "Normal", "標準"),
  size5: labels("大号", "大號", "Large", "大"), size6: labels("较大", "較大", "Large (level 2)", "より大"),
  size7: labels("特大", "特大", "Large (level 3)", "特大"), size8: labels("超大", "超大", "Huge", "超大"),
  size9: labels("最大", "最大", "Largest", "最大"),
};

export const colorPreviewValues: Record<string, string> = {
  Blue: "#2D2F92", Brown: "#792500", Gray: "#949698", Green: "#00A64F", Orange: "#F58137",
  Peach: "#FFCBA4", Purple: "#99479B", Red: "#ED1B23", Tan: "#DA9D76", Violet: "#58429B",
  Yellow: "#FFF200", userdefime: "#000000",
};

const optionNouns: Record<Locale, string> = { "zh-CN": "公式", "zh-TW": "公式", en: "formula", ja: "数式" };
const symbolNouns: Record<Locale, string> = { "zh-CN": "符号", "zh-TW": "符號", en: "Symbol", ja: "記号" };

function isUsefulName(value: string): boolean {
  const trimmed = value.trim();
  return Boolean(trimmed && trimmed !== "-" && !trimmed.startsWith("/"));
}

export function paletteOptionLabel(
  symbol: LatexSymbol,
  locale: Locale,
  category: string,
  index: number,
  isTemplate: boolean,
): string {
  if (isTemplate) return `${categoryLabel(category, locale, category)} ${optionNouns[locale]} ${index + 1}`;

  const curated = category === "greek" ? greekNames[symbol.tag] : category === "matrix" ? matrixNames[symbol.tag] : undefined;
  if (curated) return curated[locale];
  if (locale === "zh-CN" || locale === "zh-TW") {
    if (isUsefulName(symbol.zh)) return symbol.zh.trim();
  } else if (locale === "en" && isUsefulName(symbol.en)) {
    return symbol.en.trim();
  }
  const command = symbol.latex.trim().split(/\s/)[0] || symbol.tag;
  return `${symbolNouns[locale]} ${command}`;
}

export function controlOptionLabel(symbol: LatexSymbol, locale: Locale): string {
  return controlNames[symbol.tag]?.[locale]
    ?? (locale.startsWith("zh") && isUsefulName(symbol.zh) ? symbol.zh.trim() : undefined)
    ?? (locale === "en" && isUsefulName(symbol.en) ? symbol.en.trim() : undefined)
    ?? `${symbolNouns[locale]} ${symbol.latex.trim()}`;
}

export interface EnvironmentOption {
  value: LatexEnvironment;
  label: LocalizedLabel;
  latex: string;
}

export const environmentOptions: EnvironmentOption[] = [
  { value: "none", label: labels("不使用环境", "不使用環境", "No environment", "環境なし"), latex: "—" },
  { value: "eqnarray", label: labels("等式数组", "等式陣列", "Equation array", "数式配列"), latex: "\\begin{eqnarray} … \\end{eqnarray}" },
  { value: "align", label: labels("多行对齐", "多行對齊", "Multi-line alignment", "複数行の整列"), latex: "\\begin{align} … \\end{align}" },
  { value: "array", label: labels("数组", "陣列", "Array", "配列"), latex: "\\begin{array}{c} … \\end{array}" },
  { value: "aligned", label: labels("内嵌对齐", "內嵌對齊", "Inline alignment", "インライン整列"), latex: "\\begin{aligned} … \\end{aligned}" },
  { value: "gathered", label: labels("多行居中", "多行置中", "Centered lines", "複数行の中央揃え"), latex: "\\begin{gathered} … \\end{gathered}" },
  { value: "cases", label: labels("分段函数", "分段函數", "Cases", "場合分け"), latex: "\\begin{cases} … \\end{cases}" },
  { value: "split", label: labels("拆分公式", "拆分公式", "Split equation", "数式の分割"), latex: "\\begin{split} … \\end{split}" },
];
