export const LANGUAGE_VERSIONS = {
  javascript: "Node.js 12.14.0",
  typescript: "3.7.4",
  python: "3.8.1",
  java: "13.0.1",
  csharp: "Mono 6.6.0.161",
  php: "7.4.1",
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Kevin");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Kevin" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Kevin")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Kevin';\necho $name;\n",
};

export const JUDGE0_LANGS_ID = {
  javascript: "63",
  typescript: "74",
  python: "71",
  java: "62",
  csharp: "51",
  php: "68",
};