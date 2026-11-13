import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  block?: boolean;
  className?: string;
}

/**
 * Renders plain text containing inline $...$ or display $$...$$ LaTeX with KaTeX.
 * Safe against invalid LaTeX (falls back to text).
 */
export const MathText: React.FC<MathTextProps> = ({ text, block = false, className = '' }) => {
  if (block) {
    try {
      const html = katex.renderToString(text, { displayMode: true, throwOnError: false });
      return <span className={`font-mono-num ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <span className={`font-mono-num ${className}`}>{text}</span>;
    }
  }

  const tokens = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
  return (
    <span className={className}>
      {tokens.map((tok, i) => {
        if (tok.startsWith('$$') && tok.endsWith('$$')) {
          const expr = tok.slice(2, -2);
          try {
            const html = katex.renderToString(expr, { displayMode: true, throwOnError: false });
            return <span key={i} className="block my-1" dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={i}>{expr}</span>;
          }
        }
        if (tok.startsWith('$') && tok.endsWith('$')) {
          const expr = tok.slice(1, -1);
          try {
            const html = katex.renderToString(expr, { displayMode: false, throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch {
            return <span key={i}>{expr}</span>;
          }
        }
        return <React.Fragment key={i}>{tok}</React.Fragment>;
      })}
    </span>
  );
};
