"use client"

import { useEffect, useRef } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { setupMonacoEnvironment } from "@/lib/monaco-environment"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
  readOnly?: boolean
}

export function CodeEditor({ value, onChange, language = "sol", height = "400px", readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    setupMonacoEnvironment()
  }, [])

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor

    // Register Solidity language if not already registered
    if (!monaco.languages.getLanguages().some((lang) => lang.id === "sol")) {
      monaco.languages.register({ id: "sol" })

      monaco.languages.setMonarchTokensProvider("sol", {
        keywords: [
          "pragma",
          "solidity",
          "contract",
          "interface",
          "library",
          "function",
          "modifier",
          "event",
          "struct",
          "enum",
          "mapping",
          "public",
          "private",
          "internal",
          "external",
          "pure",
          "view",
          "payable",
          "returns",
          "return",
          "if",
          "else",
          "for",
          "while",
          "do",
          "break",
          "continue",
          "throw",
          "emit",
          "new",
          "delete",
          "var",
          "bool",
          "string",
          "bytes",
          "byte",
          "int",
          "uint",
          "address",
          "fixed",
          "ufixed",
          "memory",
          "storage",
          "calldata",
          "constant",
          "immutable",
          "anonymous",
          "indexed",
          "abstract",
          "virtual",
          "override",
          "constructor",
          "fallback",
          "receive",
          "type",
          "using",
          "import",
          "from",
          "as",
          "is",
          "assembly",
          "let",
          "switch",
          "case",
          "default",
          "try",
          "catch",
          "revert",
          "require",
          "assert",
        ],
        typeKeywords: ["address", "bool", "string", "uint", "int", "bytes", "byte"],
        operators: [
          "=",
          ">",
          "<",
          "!",
          "~",
          "?",
          ":",
          "==",
          "<=",
          ">=",
          "!=",
          "&&",
          "||",
          "++",
          "--",
          "+",
          "-",
          "*",
          "/",
          "&",
          "|",
          "^",
          "%",
          "<<",
          ">>",
          ">>>",
          "+=",
          "-=",
          "*=",
          "/=",
          "&=",
          "|=",
          "^=",
          "%=",
          "<<=",
          ">>=",
          ">>>=",
        ],
        symbols: /[=><!~?:&|+\-*/^%]+/,
        tokenizer: {
          root: [
            [
              /[a-z_$][\w$]*/,
              {
                cases: {
                  "@typeKeywords": "keyword",
                  "@keywords": "keyword",
                  "@default": "identifier",
                },
              },
            ],
            [/[A-Z][\w$]*/, "type.identifier"],
            { include: "@whitespace" },
            [/[{}()[\]]/, "@brackets"],
            [/[<>](?!@symbols)/, "@brackets"],
            [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
            [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
            [/0[xX][0-9a-fA-F]+/, "number.hex"],
            [/\d+/, "number"],
            [/[;,.]/, "delimiter"],
            [/"([^"\\]|\\.)*$/, "string.invalid"],
            [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
            [/'([^'\\]|\\.)*$/, "string.invalid"],
            [/'/, { token: "string.quote", bracket: "@open", next: "@string_single" }],
          ],
          comment: [
            [/[^/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            ["\\*/", "comment", "@pop"],
            [/[/*]/, "comment"],
          ],
          string: [
            [/[^\\"]+/, "string"],
            [/\\./, "string.escape.invalid"],
            [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
          string_single: [
            [/[^\\']+/, "string"],
            [/\\./, "string.escape.invalid"],
            [/'/, { token: "string.quote", bracket: "@close", next: "@pop" }],
          ],
          whitespace: [
            [/[ \t\r\n]+/, "white"],
            [/\/\*/, "comment", "@comment"],
            [/\/\/.*$/, "comment"],
          ],
        },
      })
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          readOnly,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  )
}
