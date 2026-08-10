import { MathJaxMhchemFontExtension } from "@mathjax/mathjax-mhchem-font-extension/js/svg.js";
import { MathJaxNewcmFont } from "@mathjax/mathjax-newcm-font/js/svg.js";
import { liteAdaptor } from "@mathjax/src/js/adaptors/liteAdaptor.js";
import { type LiteElement } from "@mathjax/src/js/adaptors/lite/Element.js";
import { STATE } from "@mathjax/src/js/core/MathItem.js";
import { type MmlNode } from "@mathjax/src/js/core/MmlTree/MmlNode.js";
import { SerializedMmlVisitor } from "@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js";
import { RegisterHTMLHandler } from "@mathjax/src/js/handlers/html.js";
import { TeX } from "@mathjax/src/js/input/tex.js";
import "@mathjax/src/js/input/tex/ams/AmsConfiguration.js";
import "@mathjax/src/js/input/tex/amscd/AmsCdConfiguration.js";
import "@mathjax/src/js/input/tex/bbox/BboxConfiguration.js";
import "@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js";
import "@mathjax/src/js/input/tex/cancel/CancelConfiguration.js";
import "@mathjax/src/js/input/tex/color/ColorConfiguration.js";
import { COLORS } from "@mathjax/src/js/input/tex/color/ColorConstants.js";
import "@mathjax/src/js/input/tex/configmacros/ConfigMacrosConfiguration.js";
import "@mathjax/src/js/input/tex/enclose/EncloseConfiguration.js";
import "@mathjax/src/js/input/tex/mhchem/MhchemConfiguration.js";
import "@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js";
import "@mathjax/src/js/input/tex/noerrors/NoErrorsConfiguration.js";
import "@mathjax/src/js/input/tex/physics/PhysicsConfiguration.js";
import "@mathjax/src/js/input/tex/textmacros/TextMacrosConfiguration.js";
import "@mathjax/src/js/input/tex/unicode/UnicodeConfiguration.js";
import { mathjax } from "@mathjax/src/js/mathjax.js";
import { SVG } from "@mathjax/src/js/output/svg.js";

type DynamicFontModule = () => Promise<unknown>;

const dynamicFontModules = import.meta.glob<false, string, DynamicFontModule>(
  "/node_modules/@mathjax/mathjax-newcm-font/mjs/svg/dynamic/*.js",
);

mathjax.asyncLoad = (file: string): Promise<unknown> => {
  const filename = file.split("/").at(-1);
  const modulePath = `/node_modules/@mathjax/mathjax-newcm-font/mjs/svg/dynamic/${filename}`;
  const loadModule = dynamicFontModules[modulePath];
  if (!loadModule) return Promise.reject(new Error(`缺少 MathJax 字体分片：${filename ?? file}`));
  return loadModule();
};

MathJaxNewcmFont.addExtension(MathJaxMhchemFontExtension);

// MathJax's historical dvips Peach is nearly orange. Use a modern peach tone
// consistently in live previews, exported SVG, and the source color swatch.
COLORS.set("Peach", "#FFCBA4");

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const packages = [
  "base",
  "ams",
  "amscd",
  "bbox",
  "boldsymbol",
  "cancel",
  "color",
  "configmacros",
  "enclose",
  "mhchem",
  "newcommand",
  "noerrors",
  "physics",
  "textmacros",
  "unicode",
];

const tex = new TeX({
  packages,
  processEscapes: true,
  tags: "ams",
  macros: {
    // The Physics package assigns \div to divergence. Restore the standard
    // division sign while keeping \divergence available for vector calculus.
    div: "\\divsymbol",
  },
});
const svg = new SVG({
  fontCache: "local",
  fontData: MathJaxNewcmFont,
});
const svgDocument = mathjax.document("", { InputJax: tex, OutputJax: svg });
const mmlVisitor = new SerializedMmlVisitor();

let conversionQueue: Promise<void> = Promise.resolve();
const svgCache = new Map<string, Promise<string>>();

function enqueueConversion<T>(convert: () => Promise<T>): Promise<T> {
  const result = conversionQueue.then(convert);
  conversionQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

export function renderLatexToSvg(latex: string, display = true): Promise<string> {
  const key = `${display ? "display" : "inline"}:${latex}`;
  const cached = svgCache.get(key);
  if (cached) return cached;

  const rendering = enqueueConversion(async () => {
    const node = await svgDocument.convertPromise(latex, { display }) as unknown as LiteElement;
    return adaptor.innerHTML(node);
  }).catch((error: unknown) => {
    svgCache.delete(key);
    throw error;
  });

  svgCache.set(key, rendering);
  return rendering;
}

export function convertLatexToMathMl(latex: string): Promise<string> {
  return enqueueConversion(async () => {
    const root = await svgDocument.convertPromise(latex, {
      display: true,
      end: STATE.COMPILED,
    }) as unknown as MmlNode;
    return mmlVisitor.visitTree(root);
  });
}
