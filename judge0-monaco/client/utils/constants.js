export const LANGUAGE_VERSIONS = {
  javascript: "Node.js 12.14.0",
  typescript: "3.7.4",
  python: "3.8.1",
  java: "13.0.1",
  csharp: "Mono 6.6.0.161",
  php: "7.4.1",
};

export const CODE_SNIPPETS_STRING = {
  javascript: `function firstCharacter(str) {\n    return str.charAt(0);\n}\n\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Kevin" });\n`,
  python: `def first_character(str):\n    return str[0]`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Kevin';\necho $name;\n",
};

export const CODE_SNIPPETS_MATRIX = {
  javascript: `function calculateMatrixAverage(matrix) {\n\tlet sum = 0;\n\tlet count = 0;\n\n\tmatrix.forEach(function(row) {\n\t\trow.forEach(function(cell) {\n\t\t\tsum += cell;\n\t\t\tcount++;\n\t\t});\n\t});\n\n\tconst average = sum / count;\n\tconst roundedAverage = average.toFixed(1);\n\n\treturn parseFloat(roundedAverage).toFixed(1);\n};\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Kevin" });\n`,
  python: `def calculate_matrix_average(matrix):\n\tsum = 0\n\tcount = 0\n\n\tfor row in matrix:\n\t\tfor cell in row:\n\t\t\tsum += cell\n\t\t\tcount += 1\n\n\treturn sum / count\n`,
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
