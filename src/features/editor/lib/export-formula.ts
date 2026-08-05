import temmlScriptUrl from "temml/dist/temml.min.js?url";

interface TemmlApi {
  renderToString: (latex: string, options: { displayMode: boolean; throwOnError: boolean }) => string;
}

let temmlPromise: Promise<TemmlApi> | null = null;

function loadTemml(): Promise<TemmlApi> {
  if (window.temml) return Promise.resolve(window.temml);
  if (temmlPromise) return temmlPromise;

  temmlPromise = new Promise<TemmlApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = temmlScriptUrl;
    script.async = true;
    script.onload = () => {
      if (window.temml) resolve(window.temml);
      else reject(new Error("MathML 转换器加载失败"));
    };
    script.onerror = () => reject(new Error("MathML 转换器加载失败"));
    document.head.append(script);
  });

  return temmlPromise;
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function serializeSvg(container: HTMLElement): string {
  const source = container.querySelector("svg");
  if (!(source instanceof SVGSVGElement)) throw new Error("尚无可导出的公式");

  const svg = source.cloneNode(true) as SVGSVGElement;
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const computedStyle = window.getComputedStyle(source);
  const width = Number.parseFloat(computedStyle.width);
  const height = Number.parseFloat(computedStyle.height);
  if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
    svg.setAttribute("width", `${width}px`);
    svg.setAttribute("height", `${height}px`);
  }
  return new XMLSerializer().serializeToString(svg);
}

export function downloadSvg(container: HTMLElement): void {
  saveBlob(new Blob([serializeSvg(container)], { type: "image/svg+xml;charset=utf-8" }), "latex-formula.svg");
}

export async function downloadRaster(
  container: HTMLElement,
  format: "png" | "jpeg",
  scale = 3,
): Promise<void> {
  const svgText = serializeSvg(container);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.decoding = "async";

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("公式图像转换失败"));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.ceil(image.width * scale));
    canvas.height = Math.max(1, Math.ceil(image.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("当前浏览器不支持图像导出");

    context.scale(scale, scale);
    if (format === "jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, image.width, image.height);
    }
    context.drawImage(image, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("公式图像生成失败"))),
        `image/${format}`,
        0.96,
      );
    });
    saveBlob(blob, `latex-formula.${format === "jpeg" ? "jpg" : "png"}`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function latexToMathML(latex: string): Promise<string> {
  const temml = await loadTemml();
  return temml.renderToString(latex, { displayMode: true, throwOnError: false });
}

export function latexToAsciiMath(latex: string): string {
  return latex
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\(alpha|beta|gamma|delta|theta|lambda|mu|pi|rho|sigma|phi|omega)\b/g, "$1")
    .replace(/\\times\b/g, "xx")
    .replace(/\\cdot\b/g, "*")
    .replace(/\\leq?\b/g, "<=")
    .replace(/\\geq?\b/g, ">=")
    .replace(/\\neq?\b/g, "!=")
    .replace(/\\infty\b/g, "oo")
    .replace(/\\sum\b/g, "sum")
    .replace(/\\int\b/g, "int")
    .replace(/\{([^{}]+)\}/g, "($1)")
    .replace(/\\,/g, " ")
    .trim();
}

export function latexToTypst(latex: string): string {
  return latex
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "frac($1, $2)")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)")
    .replace(/\\(alpha|beta|gamma|delta|theta|lambda|mu|pi|rho|sigma|phi|omega)\b/g, "$1")
    .replace(/\\times\b/g, "times")
    .replace(/\\cdot\b/g, "dot")
    .replace(/\\infty\b/g, "infinity")
    .replace(/\\leq?\b/g, "<=")
    .replace(/\\geq?\b/g, ">=")
    .replace(/\\neq?\b/g, "!=")
    .replace(/\\,/g, " ")
    .trim();
}

export function prefixMathML(mathml: string, prefix: "mml" | "m"): string {
  const prefixed = mathml.replace(/<(\/?)([A-Za-z][\w-]*)/g, `<$1${prefix}:$2`);
  return prefixed.replace(`<${prefix}:math`, `<${prefix}:math xmlns:${prefix}="http://www.w3.org/1998/Math/MathML"`);
}

export function mathMLWithAttribute(mathml: string): string {
  return mathml.includes("xmlns=")
    ? mathml
    : mathml.replace("<math", '<math xmlns="http://www.w3.org/1998/Math/MathML"');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function ommlRun(value: string): string {
  if (value.length === 0) return "";
  return `<m:r><m:t xml:space="preserve">${escapeXml(value)}</m:t></m:r>`;
}

function elementChildren(element: Element): Element[] {
  return Array.from(element.children);
}

function mathMlChildrenToOmml(element: Element): string {
  return elementChildren(element).map(mathMlElementToOmml).join("");
}

function mathMlElementToOmml(element: Element): string {
  const children = elementChildren(element);
  const child = (index: number): string => children[index] ? mathMlElementToOmml(children[index]) : "";

  switch (element.localName) {
    case "math":
    case "mrow":
    case "mstyle":
    case "mpadded":
    case "semantics":
      return mathMlChildrenToOmml(element);
    case "mi":
    case "mn":
    case "mo":
    case "mtext":
    case "ms":
      return ommlRun(element.textContent ?? "");
    case "mspace":
      return ommlRun(" ");
    case "mfrac":
      return `<m:f><m:num>${child(0)}</m:num><m:den>${child(1)}</m:den></m:f>`;
    case "msqrt":
      return `<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:e>${mathMlChildrenToOmml(element)}</m:e></m:rad>`;
    case "mroot":
      return `<m:rad><m:deg>${child(1)}</m:deg><m:e>${child(0)}</m:e></m:rad>`;
    case "msub":
      return `<m:sSub><m:e>${child(0)}</m:e><m:sub>${child(1)}</m:sub></m:sSub>`;
    case "msup":
      return `<m:sSup><m:e>${child(0)}</m:e><m:sup>${child(1)}</m:sup></m:sSup>`;
    case "msubsup":
      return `<m:sSubSup><m:e>${child(0)}</m:e><m:sub>${child(1)}</m:sub><m:sup>${child(2)}</m:sup></m:sSubSup>`;
    case "munder":
      return `<m:limLow><m:e>${child(0)}</m:e><m:lim>${child(1)}</m:lim></m:limLow>`;
    case "mover":
      return `<m:limUpp><m:e>${child(0)}</m:e><m:lim>${child(1)}</m:lim></m:limUpp>`;
    case "munderover":
      return `<m:limUpp><m:e><m:limLow><m:e>${child(0)}</m:e><m:lim>${child(1)}</m:lim></m:limLow></m:e><m:lim>${child(2)}</m:lim></m:limUpp>`;
    case "mtable":
      return `<m:m>${children.map(mathMlElementToOmml).join("")}</m:m>`;
    case "mtr":
    case "mlabeledtr":
      return `<m:mr>${children.map((cell) => `<m:e>${mathMlElementToOmml(cell)}</m:e>`).join("")}</m:mr>`;
    case "mtd":
      return mathMlChildrenToOmml(element);
    case "menclose":
      return `<m:borderBox><m:e>${mathMlChildrenToOmml(element)}</m:e></m:borderBox>`;
    case "annotation":
    case "annotation-xml":
      return "";
    default:
      return children.length > 0 ? mathMlChildrenToOmml(element) : ommlRun(element.textContent ?? "");
  }
}

export function mathMLToOmml(mathml: string): string {
  const documentNode = new DOMParser().parseFromString(mathml, "application/xml");
  const parserError = documentNode.querySelector("parsererror");
  if (parserError) throw new Error("MathML 解析失败");
  const math = documentNode.documentElement;
  if (math.localName !== "math") throw new Error("未找到 MathML 根元素");

  return `<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">${mathMlElementToOmml(math)}</m:oMath>`;
}

export async function latexToOmml(latex: string): Promise<string> {
  return mathMLToOmml(await latexToMathML(latex));
}

export async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}
