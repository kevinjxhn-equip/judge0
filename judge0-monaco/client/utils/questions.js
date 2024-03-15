export const questions = [
  {
    questionText: `Given a string s , you must return the first character of the string. You are guaranteed that the string has at least one character. Don't change the name of the main function on the right. You may write other code inside and outside the function.`,
    testcaseText1: { input: "aaa", output: "a" },
    testcaseText2: { input: "bc", output: "b" },
    sampleTestcases: {
      inputTestCases: ["aaa", "bc"],
      outputTestCases: ["a", "b"],
    },
    realTestCases: {
      inputTestCases: ["aaa", "bc", "def", "ghij", "klmno"],
      outputTestCases: ["a", "b", "d", "g", "k"],
    },
    boilerPlate: {
      63: `let stringValue = ''; process.stdin.on('data', function(data) { stringValue += data.toString(); }); process.stdin.on('end', function() { const s = firstCharacter(stringValue.trim()); console.log(s); });`,
      71: `string_value = input()\nresult = first_character(string_value)\nprint(result)`,
      75: 'int main() {\n char stringValue[101];\n if (fgets(stringValue, sizeof(stringValue), stdin) != NULL) {\n char s = firstCharacter(stringValue); printf("%c", s); }\n return 0;\n }',
    },
  },
  {
    questionText: `Given a nxn matrix mat , you must return the average of the matrix. You are guaranteed that the matrix mat has at least one element. Don't change the name of the main function on the right. You may write other code inside and outside the function.`,
    testcaseText1: {
      input: "[[1, 2, 3], [3, 4, 5], [7, 7, 7]]",
      output: "4.3",
    },
    testcaseText2: {
      input: "[[1, 2, 3], [1, 2, 3], [1, 2, 3]]",
      output: "2.0",
    },
    sampleTestcases: {
      inputTestCases: [`3\n1 2 3 3 4 5 7 7 7`, `3\n1 2 3 1 2 3 1 2 3`],
      outputTestCases: ["4.3", "2.0"],
    },
    realTestCases: {
      inputTestCases: [
        `3\n1 2 3 3 4 5 7 7 7`,
        `3\n1 2 3 1 2 3 1 2 3`,
        `3\n1 2 3 3 6 5 7 7 7`,
        `3\n1 2 3 1 6 3 1 2 3`,
        `3\n3 2 3 10 3 3 1 3 3`,
      ],
      outputTestCases: ["4.3", "2.0", "4.6", "2.4", "3.4"],
    },
    boilerPlate: {
      63: `let stringValue = '';process.stdin.on('data',function(data){stringValue+=data.toString();});process.stdin.on('end',function(){const inputLines=stringValue.trim().split('\\n');const size=parseInt(inputLines[0]);const values=inputLines[1].split(" ").map(Number);const matrix=[];for(let i=0;i<size;i++){matrix.push(values.slice(i*size,(i+1)*size));}const result=calculateMatrixAverage(matrix);console.log(result);});`,
      71: "stringValue = '';\nimport sys;\nfor line in sys.stdin:stringValue += line;\ninputLines=stringValue.strip().split('\\n');\nsize=int(inputLines[0]);\nvalues=list(map(int,inputLines[1].split()));\nmatrix=[];\n[matrix.append(values[i*size:(i+1)*size]) for i in range(size)];\nresult=calculate_matrix_average(matrix);\nprint(result)",
      75: `int main() {int rows;scanf("%d",&rows);int cols=3;int matrix[rows][cols];for(int i=0;i<rows;i++){for(int j=0;j<cols;j++){scanf("%d",&matrix[i][j]);}}float average=calculateMatrixAverage(matrix,rows,cols);printf("%.1f\\n",average);return 0;}`,
    },
  },
];
