export const LANGUAGE_VERSIONS = {
  javascript: "Node.js 12.14.0",
  python: "3.8.1",
  c: "Clang 7.0.1",
};

export const CODE_SNIPPETS_STRING = {
  javascript: `function firstCharacter(str) {\n    return str.charAt(0);\n}\n\n`,
  python: `def first_character(str):\n    return str[0]`,
  c: `#include <stdio.h>\n#include <stdlib.h>\n\nchar firstCharacter(const char *str) {\n    return str[0];\n}`,
};

export const CODE_SNIPPETS_MATRIX = {
  javascript: `function calculateMatrixAverage(matrix) {\n\tlet sum = 0;\n\tlet count = 0;\n\n\tmatrix.forEach(function(row) {\n\t\trow.forEach(function(cell) {\n\t\t\tsum += cell;\n\t\t\tcount++;\n\t\t});\n\t});\n\n\tconst average = sum / count;\n\tconst roundedAverage = average.toFixed(1);\n\n\treturn parseFloat(roundedAverage).toFixed(1);\n};\n`,
  python: `def calculate_matrix_average(matrix):\n\tsum = 0\n\tcount = 0\n\n\tfor row in matrix:\n\t\tfor cell in row:\n\t\t\tsum += cell\n\t\t\tcount += 1\n\n\treturn round(sum / count, 1)\n`,
  c: `#include <stdio.h>\n#include <stdlib.h>\n\nfloat calculateMatrixAverage(int matrix[][3], int rows, int cols) {\n\tint sum = 0;\n\tint count = 0;\n\n\tfor (int i = 0; i < rows; i++) {\n\t\tfor (int j = 0; j < cols; j++) {\n\t\t\tsum += matrix[i][j];\n\t\t\tcount++;\n\t\t}\n\t}\n\n\tfloat average = (float)sum / count;\n\treturn average;\n}\n`,
};

export const JUDGE0_LANGS_ID = {
  javascript: "63",
  python: "71",
  c: "75",
};
