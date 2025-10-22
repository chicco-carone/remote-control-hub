"use client";

import type React from "react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
export interface CodeHighlighterProps {
  code: string;
  language: "yaml" | "json";
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  customStyle?: React.CSSProperties;
  className?: string;
}

export function CodeHighlighter({
  code,
  language,
  showLineNumbers = true,
  wrapLines = true,
  customStyle = {},
  className = "",
}: CodeHighlighterProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <pre
        className={`bg-muted/50 p-4 rounded-md text-sm font-mono overflow-auto ${className}`}
      >
        <code>{code}</code>
      </pre>
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const enhancedStyle = {
    margin: 0,
    padding: "1rem",
    background: "transparent",
    fontSize: "12px",
    lineHeight: "1.5",
    fontFamily:
      "ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    ...customStyle,
  };

  const lineNumberStyle = {
    minWidth: "3em",
    paddingRight: "1em",
    color: isDark ? "#6b7280" : "#9ca3af",
    fontSize: "11px",
    userSelect: "none" as const,
  };

  return (
    <div className={`relative ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={enhancedStyle}
        wrapLines={wrapLines}
        wrapLongLines={true}
        showLineNumbers={showLineNumbers}
        lineNumberStyle={lineNumberStyle}
        PreTag="div"
        CodeTag="code"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function ESPHomeHighlighter({
  code,
  showLineNumbers = true,
  className = "",
}: {
  code: string;
  showLineNumbers?: boolean;
  className?: string;
}) {
  return (
    <CodeHighlighter
      code={code}
      language="yaml"
      showLineNumbers={showLineNumbers}
      className={className}
      customStyle={{
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    />
  );
}

export function JSONHighlighter({
  code,
  showLineNumbers = true,
  className = "",
}: {
  code: string;
  showLineNumbers?: boolean;
  className?: string;
}) {
  return (
    <CodeHighlighter
      code={code}
      language="json"
      showLineNumbers={showLineNumbers}
      className={className}
      customStyle={{
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    />
  );
}
