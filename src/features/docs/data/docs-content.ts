export type DocsLanguage = "zh-CN" | "en";

export interface DocExample {
  label: string;
  code: string;
}

export interface DocSection {
  id: string;
  title: string;
  lead: string;
  items?: string[];
  note?: string;
  examples?: DocExample[];
}

export interface DocsContent {
  title: string;
  contentsLabel: string;
  backLabel: string;
  languageLabel: string;
  themeLabel: string;
  exampleLabel: string;
  noteLabel: string;
  sections: DocSection[];
}

const zhCN: DocsContent = {
  title: "LaTeX Live 使用文档",
  contentsLabel: "目录",
  backLabel: "返回编辑器",
  languageLabel: "文档语言",
  themeLabel: "切换主题",
  exampleLabel: "示例",
  noteLabel: "提示",
  sections: [
    {
      id: "basic-input",
      title: "1. 基本输入",
      lead: "编辑器默认处于数学模式，直接输入 LaTeX 公式即可，不需要添加 $...$、$$...$$、<math> 标签或 document 环境。花括号用于把多个字符组合成一个参数。",
      items: [
        "命令以反斜杠开头，例如 \\alpha、\\sqrt 和 \\frac。",
        "输入命令时可使用自动补全，按 Tab 接受首个候选。",
        "# % & _ { } 等字符具有特殊含义；需要显示字符本身时使用转义形式。",
      ],
      note: "此处只编辑数学公式，不要输入 \\begin{document}、\\usepackage 等完整 LaTeX 文档命令。",
      examples: [
        { label: "一个完整公式", code: String.raw`\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}` },
        { label: "显示保留字符", code: String.raw`\#\; \%\; \&\; \_\; \{\; \}\; \backslash` },
      ],
    },
    {
      id: "symbols",
      title: "2. 符号与字母",
      lead: "常用数学符号通常由一个命令表示。希腊字母区分大小写；关系、集合、逻辑和箭头符号可直接组合成表达式。快捷工具中的“常用符号”和“希腊字母”菜单可以直接插入这些命令。",
      items: [
        "希腊字母：\\alpha、\\beta、\\gamma、\\theta、\\lambda、\\pi、\\sigma、\\omega；大写形式使用 \\Gamma、\\Delta、\\Theta、\\Lambda、\\Pi、\\Sigma、\\Omega。",
        "关系符号：\\ne、\\approx、\\equiv、\\le、\\ge、\\propto。",
        "集合与逻辑：\\in、\\notin、\\subseteq、\\cup、\\cap、\\forall、\\exists、\\therefore。",
        "箭头：\\to、\\mapsto、\\Rightarrow、\\Leftrightarrow、\\leftrightarrow。",
      ],
      examples: [
        { label: "希腊字母", code: String.raw`\alpha+\beta=\gamma,\qquad \Delta=\frac{b^2-4ac}{4a^2}` },
        { label: "集合与逻辑", code: String.raw`x\in A\cap B \Rightarrow x\in A \land x\in B` },
      ],
    },
    {
      id: "fractions-functions",
      title: "3. 分式、根式与函数",
      lead: "分式的两个花括号分别表示分子和分母；根式的方括号表示根指数。标准函数应使用专用命令，以获得正确的直立字体和间距。",
      items: [
        "\\frac 是普通分式；\\tfrac 强制使用较小样式；\\dfrac 强制使用展示样式；连续分式可使用 \\cfrac。",
        "平方根使用 \\sqrt{x}，n 次根使用 \\sqrt[n]{x}。",
        "常用函数包括 \\sin、\\cos、\\tan、\\log、\\ln、\\exp、\\min、\\max。",
        "没有预定义的函数名可使用 \\operatorname{name}。",
      ],
      examples: [
        { label: "分式和根式", code: String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}` },
        { label: "连续分式", code: String.raw`a_0+\cfrac{1}{a_1+\cfrac{1}{a_2+x}}` },
        { label: "函数", code: String.raw`\sin^2 x+\cos^2 x=1,\qquad \operatorname{sgn}(x)` },
      ],
    },
    {
      id: "scripts-accents",
      title: "4. 上下标、导数与标记",
      lead: "字符后的 ^ 表示上标，_ 表示下标。单个字符可以直接跟在符号后；多个字符必须放入花括号。",
      items: [
        "组合上下标：x_i^2、a_{m,n}^{k+1}。",
        "导数：f'、f''、f^{(n)}、\\dot{x}、\\ddot{x}。",
        "顶部标记：\\hat{x}、\\bar{x}、\\vec{x}、\\overline{AB}、\\widehat{ABC}。",
        "上下说明：\\overset{top}{x}、\\underset{bottom}{x}、\\overbrace 和 \\underbrace。",
      ],
      examples: [
        { label: "上下标与导数", code: String.raw`a_{i,j}^{n+1}+f''(x)+\ddot{x}` },
        { label: "向量与大括号", code: String.raw`\vec{v}=\overrightarrow{AB},\qquad \underbrace{1+\cdots+1}_{n}` },
      ],
    },
    {
      id: "calculus",
      title: "5. 极限、微积分与大型运算",
      lead: "极限、积分、求和与乘积使用上下标指定范围。多重积分分别使用 \\iint、\\iiint 和 \\iiiint；闭合路径积分使用 \\oint。",
      items: [
        "极限：\\lim_{x \\to 0}；上下确界：\\inf、\\sup、\\liminf、\\limsup。",
        "微分：\\mathrm{d}x；偏导：\\partial；梯度：\\nabla。",
        "大型运算：\\sum、\\prod、\\coprod、\\bigcup、\\bigcap、\\bigvee、\\bigwedge。",
        "使用 \\limits 可强制把上下标放到运算符正上方和正下方。",
      ],
      examples: [
        { label: "极限与导数", code: String.raw`\lim_{x\to 0}\frac{\sin x}{x}=1,\qquad \frac{\partial^2 f}{\partial x\partial y}` },
        { label: "积分", code: String.raw`\iint\limits_D (x^2+y^2)\,\mathrm{d}x\,\mathrm{d}y` },
        { label: "求和与乘积", code: String.raw`\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}{6},\qquad \prod_{i=1}^{n}x_i` },
      ],
    },
    {
      id: "matrices",
      title: "6. 矩阵、数组与分段函数",
      lead: "矩阵和数组都属于环境。& 分隔列，\\\\ 分隔行；不同矩阵环境决定外侧括号样式。",
      items: [
        "matrix 无括号；pmatrix 使用圆括号；bmatrix 使用方括号；Bmatrix 使用花括号。",
        "vmatrix 和 Vmatrix 常用于行列式与范数。",
        "array 需要 {lcr} 等列对齐参数，l、c、r 分别表示左、中、右对齐；\\hline 添加横线。",
        "cases 适合分段函数或方程组；二项式系数使用 \\binom{n}{k}。",
      ],
      examples: [
        {
          label: "方阵", code: String.raw`\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}` },
        {
          label: "分段函数", code: String.raw`f(x)=\begin{cases}
x^2, & x\ge 0 \\
-x, & x<0
\end{cases}` },
        {
          label: "带边框的数组", code: String.raw`\begin{array}{|c|c|}
a & b \\
\hline
0 & 1
\end{array}` },
      ],
    },
    {
      id: "brackets",
      title: "7. 括号与定界符",
      lead: "普通括号不会随内容自动伸缩。复杂分式、矩阵或多行内容应使用 \\left 和 \\right，让两侧定界符匹配内容高度。",
      items: [
        "圆括号、方括号、花括号：()、[]、\\{\\}。",
        "角括号：\\langle、\\rangle；单竖线与双竖线：\\vert、\\Vert。",
        "取整与取顶：\\lfloor、\\rfloor、\\lceil、\\rceil。",
        "只显示一侧时，另一侧使用不可见定界符 \\left. 或 \\right.。",
      ],
      examples: [
        { label: "自动伸缩", code: String.raw`\left(\frac{a}{b}\right)^n,\qquad \left\lVert\vec{x}\right\rVert` },
        { label: "单侧括号", code: String.raw`\left.\frac{\mathrm{d}}{\mathrm{d}x}f(x)\right|_{x=0}` },
      ],
    },
    {
      id: "spacing-text",
      title: "8. 空格、文本与换行",
      lead: "LaTeX 会忽略源码中的大部分普通空格。需要精确控制时，应使用数学间距命令；公式中的自然语言使用 \\text{}。",
      items: [
        "从小到大的常用间距：\\,、\\;、\\quad、\\qquad；\\! 表示负间距。",
        "\\text{...} 用于条件、单位和说明文字；变量仍应放在文本命令之外。",
        "\\\\ 只有在 align、array、matrix、cases、gathered 等多行环境中才会换行。",
      ],
      examples: [
        { label: "间距和单位", code: String.raw`v=12\,\mathrm{m}\,\mathrm{s}^{-1},\qquad a\!b` },
        { label: "公式内文本", code: String.raw`f(x)=0\quad\text{when}\quad x<0` },
      ],
    },
    {
      id: "environments",
      title: "9. 多行公式与环境",
      lead: "环境以 \\begin{name} 开始、以 \\end{name} 结束。“环境”菜单可以为当前源码添加或移除常用外层环境。",
      items: [
        "align：推荐的多行等式环境，使用 & 指定对齐点。",
        "aligned：适合嵌套在另一个公式中的紧凑对齐块；split：拆分一条较长公式。",
        "gathered：多行居中且不按等号对齐；cases：分段表达式。",
        "eqnarray：传统三列对齐环境；array：可自定义列数和对齐方式。",
        "none：移除当前最外层环境，保留其中的公式内容。",
      ],
      examples: [
        {
          label: "按等号对齐", code: String.raw`\begin{align}
(a+b)^2 &= a^2+2ab+b^2 \\
(a-b)^2 &= a^2-2ab+b^2
\end{align}` },
        {
          label: "多行居中", code: String.raw`\begin{gathered}
x+y=10 \\
x-y=2
\end{gathered}` },
      ],
    },
    {
      id: "equation-numbering",
      title: "10. 方程编号",
      lead: "AMS 环境支持自动编号和自定义编号。使用带星号的环境可关闭整组编号，\\tag{} 可指定编号内容，\\notag 可取消某一行编号。",
      items: [
        "align 与 equation 等环境默认可以编号；align*、equation* 不编号。",
        "在某行末尾添加 \\tag{A} 可显示自定义编号。",
        "在某行末尾添加 \\notag 可隐藏该行编号。",
      ],
      examples: [
        {
          label: "自定义编号", code: String.raw`\begin{align}
E &= mc^2 \tag{1} \\
e^{i\pi}+1 &= 0 \tag{Euler}
\end{align}` },
      ],
    },
    {
      id: "colors",
      title: "11. 公式颜色与背景",
      lead: "使用颜色命令时，应通过花括号明确作用范围，避免后续公式意外继承颜色。工具栏中的“字体颜色”可直接插入常用颜色。",
      items: [
        "前景色：{\\color{Blue} ... }。",
        "RGB 颜色：{\\color[RGB]{0,120,220} ... }。",
        "背景色：\\colorbox{yellow}{...}；数学内容可放入 \\displaystyle。",
        "\\bbox[color,padding]{...} 可以同时设置数学内容的背景和留白。",
      ],
      examples: [
        { label: "多色公式", code: String.raw`{\color{Blue}x^2}+{\color{Orange}2x}-{\color{Green}1}` },
        { label: "背景颜色", code: String.raw`\bbox[LightBlue,4px]{\frac{a+b}{c+d}}` },
      ],
    },
    {
      id: "fonts-sizes",
      title: "12. 数学字体与相对字号",
      lead: "字体命令用于区分变量、常量、集合或特殊记号；字号命令改变公式内部元素的相对大小。工具栏中的字体和字号菜单可以直接插入对应命令。",
      items: [
        "直立体 \\mathrm、粗体 \\mathbf、斜体 \\mathit、无衬线 \\mathsf。",
        "黑板粗体 \\mathbb、花体 \\mathcal、Fraktur \\mathfrak。",
        "常用相对字号：\\tiny、\\scriptsize、\\small、\\normalsize、\\large、\\Large、\\LARGE、\\huge、\\Huge。",
      ],
      examples: [
        { label: "字体", code: String.raw`\mathbb{R}\subset\mathbb{C},\qquad \mathcal{F}\{f\},\qquad \mathbf{v}` },
        { label: "相对字号", code: String.raw`{\small x+y}\quad x+y\quad {\Huge x+y}` },
      ],
    },
    {
      id: "extensions",
      title: "13. 物理、化学与扩展命令",
      lead: "编辑器已加载常用 MathJax 扩展，可直接输入物理、化学、约分、Unicode 和交换图等命令。",
      items: [
        "Physics：\\qty、\\dv、\\pdv、\\abs、\\norm、\\bra、\\ket、\\braket。",
        "Mhchem：\\ce{H2O}、离子 \\ce{SO4^2-}、反应式 \\ce{2H2 + O2 -> 2H2O}。",
        "Cancel：\\cancel、\\bcancel、\\xcancel、\\cancelto。",
        "Unicode：\\unicode{x220F}；AMSCD：CD 环境；自定义宏可使用 \\def 或 \\newcommand。",
      ],
      examples: [
        { label: "物理", code: String.raw`\dv{x}{t}=v,\qquad \ket{\psi}=\alpha\ket{0}+\beta\ket{1}` },
        { label: "化学", code: String.raw`\ce{2H2 + O2 -> 2H2O},\qquad \ce{SO4^2- + Ba^2+ -> BaSO4 v}` },
        { label: "约分", code: String.raw`\frac{\cancel{x}(x+1)}{\cancel{x}}=x+1` },
      ],
    },
    {
      id: "export-sharing",
      title: "14. 导出与分享",
      lead: "完成公式后，可根据后续用途选择图像、源码或带定界符的文本。所有代码类输出都会复制到剪贴板。",
      items: [
        "SVG 适合论文排版和矢量编辑；PNG、JPG 适合演示文稿和普通图片场景。",
        "LaTeX、ASCIIMath、Typst、HTML、MathML、OMML 和 SVG Code 用于不同编辑器或文档系统。",
        "转义菜单可生成 $...$、$$...$$、\\(...\\)、\\[...\\]、反斜杠转义和 JSON 字符串。",
        "分享 URL 会把当前公式放入链接，接收者打开后可以继续编辑。",
      ],
    },
  ],
};

const en: DocsContent = {
  title: "LaTeX Live Documentation",
  contentsLabel: "Contents",
  backLabel: "Back to editor",
  languageLabel: "Documentation language",
  themeLabel: "Toggle theme",
  exampleLabel: "Example",
  noteLabel: "Note",
  sections: [
    {
      id: "basic-input",
      title: "1. Basic input",
      lead: "The editor is already in math mode. Enter LaTeX directly without $...$, $$...$$, <math> tags, or a document environment. Braces group multiple characters into one argument.",
      items: [
        "Commands begin with a backslash, such as \\alpha, \\sqrt, and \\frac.",
        "Use autocomplete while typing a command and press Tab to accept the first suggestion.",
        "Characters such as # % & _ { } have special meanings; escape them when you need the literal character.",
      ],
      note: "This editor accepts mathematical expressions, not a complete LaTeX document. Do not enter \\begin{document} or \\usepackage.",
      examples: [
        { label: "A complete formula", code: String.raw`\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}` },
        { label: "Literal reserved characters", code: String.raw`\#\; \%\; \&\; \_\; \{\; \}\; \backslash` },
      ],
    },
    {
      id: "symbols",
      title: "2. Symbols and alphabets",
      lead: "Most mathematical symbols are written as a command. Greek letters are case-sensitive, while relation, set, logic, and arrow commands can be combined directly into expressions. Quick tools can insert these commands for you.",
      items: [
        "Greek: \\alpha, \\beta, \\gamma, \\theta, \\lambda, \\pi, \\sigma, \\omega; uppercase forms include \\Gamma, \\Delta, \\Theta, \\Lambda, \\Pi, \\Sigma, and \\Omega.",
        "Relations: \\ne, \\approx, \\equiv, \\le, \\ge, \\propto.",
        "Sets and logic: \\in, \\notin, \\subseteq, \\cup, \\cap, \\forall, \\exists, \\therefore.",
        "Arrows: \\to, \\mapsto, \\Rightarrow, \\Leftrightarrow, \\leftrightarrow.",
      ],
      examples: [
        { label: "Greek letters", code: String.raw`\alpha+\beta=\gamma,\qquad \Delta=\frac{b^2-4ac}{4a^2}` },
        { label: "Sets and logic", code: String.raw`x\in A\cap B \Rightarrow x\in A \land x\in B` },
      ],
    },
    {
      id: "fractions-functions",
      title: "3. Fractions, radicals, and functions",
      lead: "The two arguments of a fraction are its numerator and denominator. The optional square-bracket argument of a radical is its index. Use dedicated commands for standard functions to get correct upright lettering and spacing.",
      items: [
        "\\frac is a normal fraction; \\tfrac forces a compact style; \\dfrac forces display style; use \\cfrac for continued fractions.",
        "Use \\sqrt{x} for a square root and \\sqrt[n]{x} for an nth root.",
        "Standard functions include \\sin, \\cos, \\tan, \\log, \\ln, \\exp, \\min, and \\max.",
        "Create an unlisted function name with \\operatorname{name}.",
      ],
      examples: [
        { label: "Fraction and radical", code: String.raw`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}` },
        { label: "Continued fraction", code: String.raw`a_0+\cfrac{1}{a_1+\cfrac{1}{a_2+x}}` },
        { label: "Functions", code: String.raw`\sin^2 x+\cos^2 x=1,\qquad \operatorname{sgn}(x)` },
      ],
    },
    {
      id: "scripts-accents",
      title: "4. Scripts, derivatives, and accents",
      lead: "A caret creates a superscript and an underscore creates a subscript. A single character can follow directly; group multiple characters in braces.",
      items: [
        "Combined scripts: x_i^2 and a_{m,n}^{k+1}.",
        "Derivatives: f', f'', f^{(n)}, \\dot{x}, and \\ddot{x}.",
        "Accents: \\hat{x}, \\bar{x}, \\vec{x}, \\overline{AB}, and \\widehat{ABC}.",
        "Annotations: \\overset{top}{x}, \\underset{bottom}{x}, \\overbrace, and \\underbrace.",
      ],
      examples: [
        { label: "Scripts and derivatives", code: String.raw`a_{i,j}^{n+1}+f''(x)+\ddot{x}` },
        { label: "Vectors and braces", code: String.raw`\vec{v}=\overrightarrow{AB},\qquad \underbrace{1+\cdots+1}_{n}` },
      ],
    },
    {
      id: "calculus",
      title: "5. Limits, calculus, and large operators",
      lead: "Limits, integrals, sums, and products use scripts to define their ranges. Use \\iint, \\iiint, and \\iiiint for multiple integrals, and \\oint for a closed path integral.",
      items: [
        "Limits: \\lim_{x \\to 0}; bounds: \\inf, \\sup, \\liminf, and \\limsup.",
        "Differentials: \\mathrm{d}x; partial derivatives: \\partial; gradient: \\nabla.",
        "Large operators: \\sum, \\prod, \\coprod, \\bigcup, \\bigcap, \\bigvee, and \\bigwedge.",
        "Add \\limits to force scripts directly above and below an operator.",
      ],
      examples: [
        { label: "Limit and derivative", code: String.raw`\lim_{x\to 0}\frac{\sin x}{x}=1,\qquad \frac{\partial^2 f}{\partial x\partial y}` },
        { label: "Integral", code: String.raw`\iint\limits_D (x^2+y^2)\,\mathrm{d}x\,\mathrm{d}y` },
        { label: "Sum and product", code: String.raw`\sum_{k=1}^{n}k^2=\frac{n(n+1)(2n+1)}{6},\qquad \prod_{i=1}^{n}x_i` },
      ],
    },
    {
      id: "matrices",
      title: "6. Matrices, arrays, and cases",
      lead: "Matrices and arrays are environments. An ampersand separates columns and \\\\ separates rows; the chosen matrix environment controls its outer delimiters.",
      items: [
        "matrix has no delimiters; pmatrix uses parentheses; bmatrix uses brackets; Bmatrix uses braces.",
        "vmatrix and Vmatrix are commonly used for determinants and norms.",
        "array requires column alignment such as {lcr}; l, c, and r mean left, center, and right. Add \\hline for a horizontal rule.",
        "cases is useful for piecewise functions or systems; use \\binom{n}{k} for binomial coefficients.",
      ],
      examples: [
        {
          label: "Square matrix", code: String.raw`\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}` },
        {
          label: "Piecewise function", code: String.raw`f(x)=\begin{cases}
x^2, & x\ge 0 \\
-x, & x<0
\end{cases}` },
        {
          label: "Bordered array", code: String.raw`\begin{array}{|c|c|}
a & b \\
\hline
0 & 1
\end{array}` },
      ],
    },
    {
      id: "brackets",
      title: "7. Brackets and delimiters",
      lead: "Ordinary brackets do not grow with their content. Use \\left and \\right around fractions, matrices, or multiline content to size both delimiters automatically.",
      items: [
        "Parentheses, brackets, and braces: (), [], and \\{\\}.",
        "Angles: \\langle and \\rangle; bars: \\vert and \\Vert.",
        "Floor and ceiling: \\lfloor, \\rfloor, \\lceil, and \\rceil.",
        "To show only one side, use the invisible delimiter \\left. or \\right. on the other side.",
      ],
      examples: [
        { label: "Automatic sizing", code: String.raw`\left(\frac{a}{b}\right)^n,\qquad \left\lVert\vec{x}\right\rVert` },
        { label: "One-sided delimiter", code: String.raw`\left.\frac{\mathrm{d}}{\mathrm{d}x}f(x)\right|_{x=0}` },
      ],
    },
    {
      id: "spacing-text",
      title: "8. Spacing, text, and line breaks",
      lead: "LaTeX ignores most ordinary spaces in source. Use math spacing commands when spacing matters, and place natural-language text inside \\text{}.",
      items: [
        "Common spaces from small to large are \\, , \\;, \\quad, and \\qquad; \\! is a negative space.",
        "Use \\text{...} for conditions, units, and explanations while keeping variables outside it.",
        "\\\\ creates a new row only inside multiline environments such as align, array, matrix, cases, and gathered.",
      ],
      examples: [
        { label: "Spacing and units", code: String.raw`v=12\,\mathrm{m}\,\mathrm{s}^{-1},\qquad a\!b` },
        { label: "Text in a formula", code: String.raw`f(x)=0\quad\text{when}\quad x<0` },
      ],
    },
    {
      id: "environments",
      title: "9. Multiline formulas and environments",
      lead: "An environment begins with \\begin{name} and ends with \\end{name}. The Environment menu can add or remove common outer environments around the current source.",
      items: [
        "align is the recommended multiline equation environment; use & to choose alignment points.",
        "aligned creates a compact aligned block inside another formula; split breaks one long equation.",
        "gathered centers multiple rows without aligning equals signs; cases creates piecewise expressions.",
        "eqnarray is a traditional three-column alignment; array provides custom columns and alignment.",
        "none removes the current outer environment while preserving its formula content.",
      ],
      examples: [
        {
          label: "Align at equals signs", code: String.raw`\begin{align}
(a+b)^2 &= a^2+2ab+b^2 \\
(a-b)^2 &= a^2-2ab+b^2
\end{align}` },
        {
          label: "Centered rows", code: String.raw`\begin{gathered}
x+y=10 \\
x-y=2
\end{gathered}` },
      ],
    },
    {
      id: "equation-numbering",
      title: "10. Equation numbering",
      lead: "AMS environments support automatic and custom equation numbers. Starred environments disable numbering for the group; \\tag{} sets a number explicitly and \\notag suppresses one row.",
      items: [
        "align and equation can display numbers; align* and equation* do not.",
        "Add \\tag{A} at the end of a row to set a custom label.",
        "Add \\notag at the end of a row to suppress that row's number.",
      ],
      examples: [
        {
          label: "Custom labels", code: String.raw`\begin{align}
E &= mc^2 \tag{1} \\
e^{i\pi}+1 &= 0 \tag{Euler}
\end{align}` },
      ],
    },
    {
      id: "colors",
      title: "11. Formula colors and backgrounds",
      lead: "Group a color command in braces to make its scope explicit and avoid coloring later content. The Text color menu can insert common colors directly.",
      items: [
        "Foreground: {\\color{Blue} ... }.",
        "RGB color: {\\color[RGB]{0,120,220} ... }.",
        "Background: \\colorbox{yellow}{...}; use \\displaystyle for mathematical content.",
        "\\bbox[color,padding]{...} can set both background color and padding around mathematics.",
      ],
      examples: [
        { label: "Multiple colors", code: String.raw`{\color{Blue}x^2}+{\color{Orange}2x}-{\color{Green}1}` },
        { label: "Colored background", code: String.raw`\bbox[LightBlue,4px]{\frac{a+b}{c+d}}` },
      ],
    },
    {
      id: "fonts-sizes",
      title: "12. Math fonts and relative sizes",
      lead: "Font commands distinguish variables, constants, sets, and special notation. Size commands change the relative size of elements inside a formula. The Font style and Font size menus can insert these commands.",
      items: [
        "Upright \\mathrm, bold \\mathbf, italic \\mathit, and sans serif \\mathsf.",
        "Blackboard bold \\mathbb, calligraphic \\mathcal, and Fraktur \\mathfrak.",
        "Relative sizes: \\tiny, \\scriptsize, \\small, \\normalsize, \\large, \\Large, \\LARGE, \\huge, and \\Huge.",
      ],
      examples: [
        { label: "Fonts", code: String.raw`\mathbb{R}\subset\mathbb{C},\qquad \mathcal{F}\{f\},\qquad \mathbf{v}` },
        { label: "Relative sizes", code: String.raw`{\small x+y}\quad x+y\quad {\Huge x+y}` },
      ],
    },
    {
      id: "extensions",
      title: "13. Physics, chemistry, and extensions",
      lead: "Common MathJax extensions are available for physics, chemistry, cancellation, Unicode symbols, and commutative diagrams.",
      items: [
        "Physics: \\qty, \\dv, \\pdv, \\abs, \\norm, \\bra, \\ket, and \\braket.",
        "Mhchem: \\ce{H2O}, ions such as \\ce{SO4^2-}, and reactions such as \\ce{2H2 + O2 -> 2H2O}.",
        "Cancel: \\cancel, \\bcancel, \\xcancel, and \\cancelto.",
        "Unicode: \\unicode{x220F}; AMSCD: the CD environment; custom macros can use \\def or \\newcommand.",
      ],
      examples: [
        { label: "Physics", code: String.raw`\dv{x}{t}=v,\qquad \ket{\psi}=\alpha\ket{0}+\beta\ket{1}` },
        { label: "Chemistry", code: String.raw`\ce{2H2 + O2 -> 2H2O},\qquad \ce{SO4^2- + Ba^2+ -> BaSO4 v}` },
        { label: "Cancellation", code: String.raw`\frac{\cancel{x}(x+1)}{\cancel{x}}=x+1` },
      ],
    },
    {
      id: "export-sharing",
      title: "14. Export and sharing",
      lead: "When a formula is ready, choose an image, source representation, or delimited text for its destination. Code-based exports are copied to the clipboard.",
      items: [
        "SVG is suited to publishing and vector editing; PNG and JPG are useful in presentations and general image workflows.",
        "LaTeX, ASCIIMath, Typst, HTML, MathML, OMML, and SVG Code target different editors and document systems.",
        "Escape can generate $...$, $$...$$, \\(...\\), \\[...\\], escaped backslashes, and JSON strings.",
        "A share URL carries the current formula so another person can open it and continue editing.",
      ],
    },
  ],
};

export const docsByLanguage: Record<DocsLanguage, DocsContent> = { "zh-CN": zhCN, en };
