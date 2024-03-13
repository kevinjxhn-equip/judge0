// Function to decode base64 data from Judge0
const decodeBase64 = (data) => {
  const decodedData = {};
  for (const key in data) {
    if (key === "time" || key === "token") {
      // Skip decoding for keys "time" and "token"
      decodedData[key] = data[key];
    } else {
      try {
        decodedData[key] = Buffer.from(data[key], "base64").toString("utf-8");
      } catch (error) {
        // If decoding fails, keep the original value
        decodedData[key] = data[key];
      }
    }
  }

  return decodedData;
};

// Function to sort the data based on token
const sortByToken = (tokenData, dataToSort) => {
  return dataToSort.sort((a, b) => {
    const tokenA = tokenData.findIndex(
      (tokenObj) => tokenObj.token === a.token
    );
    const tokenB = tokenData.findIndex(
      (tokenObj) => tokenObj.token === b.token
    );
    return tokenA - tokenB;
  });
};

// Function to append source code based on language and function name
const appendSourceCodeBasedOnLanguageAndFunctionName = (
  langId,
  sourceCode,
  functionName,
  inputTestCases
) => {
  const sourceCodeArray = [];

  const languagePrintFunction = {
    63: "console.log", // JavaScript
    71: "print", // Python
    75: "printf", // C
  };

  const cFormatSpecifier = {
    firstCharacter: "%c",
    calculateMatrixAverage: "%.1f",
  };

  const serializeArgument = (arg) => {
    if (typeof arg === "string") return `${arg}`;
    if (Array.isArray(arg)) return `[${arg.map(serializeArgument).join(", ")}]`;
    if (typeof arg === "object") return JSON.stringify(arg);
    return arg.toString();
  };

  // Convert single inputTestCase to an array if it's not already an array
  if (!Array.isArray(inputTestCases)) {
    inputTestCases = [inputTestCases];
  }

  for (let inputTestCase of inputTestCases) {
    const printFunction = languagePrintFunction[langId];
    const args = Array.isArray(inputTestCase)
      ? inputTestCase.map(serializeArgument)
      : [serializeArgument(inputTestCase)];

    let sourceCodeLine;
    if (langId === "75") {
      // C language
      if (functionName === "firstCharacter") {
        const formatSpecifier = cFormatSpecifier[functionName];
        sourceCodeLine = `${sourceCode}\nint main() {\n${printFunction}("${formatSpecifier}", ${functionName}(${args.join(
          ", "
        )}));\nreturn 0;\n}`;
      } else if (functionName === "calculateMatrixAverage") {
        const formatSpecifier = cFormatSpecifier[functionName];
        const matrix = args[0].replace(/\[/g, "{").replace(/\]/g, "}");
        sourceCodeLine = `${sourceCode}\nint main() {\nint matrix[3][3] = ${matrix};\n${printFunction}("${formatSpecifier}", ${functionName}(matrix, 3, 3));\nreturn 0;\n}`;
      }
    } else {
      sourceCodeLine = `${sourceCode}\n${printFunction}(${functionName}(${args.join(
        ", "
      )}))`;
    }
    sourceCodeArray.push(sourceCodeLine);
  }
  return sourceCodeArray;
};

const camelToSnake = (camelCase) => {
  let snakeCase = "";
  for (let i = 0; i < camelCase.length; i++) {
    const char = camelCase[i];
    if (char === char.toUpperCase()) {
      snakeCase += "_" + char.toLowerCase();
    } else {
      snakeCase += char;
    }
  }
  // If the string starts with an uppercase letter, lowercase the first letter in the snake_case string
  if (snakeCase[0] === "_") {
    snakeCase = snakeCase.substring(1);
  }
  return snakeCase;
};

module.exports = {
  decodeBase64,
  sortByToken,
  appendSourceCodeBasedOnLanguageAndFunctionName,
  camelToSnake,
};
