import { questions } from "../judge0-monaco/client/utils/questions.js";

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

export function appendBoilerPlateToSourceCode(
  sourceCode,
  functionName,
  langId
) {
  const boilerPlate =
    questions[functionName === "firstCharacter" ? 0 : 1].boilerPlate[langId];
  const appendedSourceCode = sourceCode + "\n" + boilerPlate;

  console.log(appendedSourceCode);
  return appendedSourceCode;
}

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
