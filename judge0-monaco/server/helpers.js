// Function to decode base64 data from Judge0
export const decodeBase64 = (data) => {
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
export const sortByToken = (tokenData, dataToSort) => {
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
export const appendSourceCodeBasedOnLanguageAndFunctionName = (
  language,
  sourceCode,
  functionName,
  inputTestCases
) => {
  const sourceCodeArray = [];

  const languagePrintFunction = {
    63: "console.log", // JavaScript
    71: "print", // Python
    74: "console.log", // TypeScript
    62: "System.out.println", // Java
    51: "Console.WriteLine", // C#
    68: "echo", // PHP
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
    const printFunction = languagePrintFunction[language];
    const args = Array.isArray(inputTestCase)
      ? inputTestCase.map(serializeArgument)
      : [serializeArgument(inputTestCase)];

    const sourceCodeLine = `${sourceCode}\n${printFunction}(${functionName}(${args.join(
      ", "
    )}))`;
    sourceCodeArray.push(sourceCodeLine);
  }
  return sourceCodeArray;
};
