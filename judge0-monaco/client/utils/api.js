import axios from "axios";
import { JUDGE0_LANGS_ID, TEST_CASES } from "./constants";

const baseUrl = "http://localhost:3000";

const appendSourceCodeBasedOnLanguageAndFunctionName = (
  language,
  sourceCode,
  functionName,
  inputTestCases
) => {
  const sourceCodeArray = [];
  console.log(inputTestCases);
  const languagePrintFunction = {
    javascript: "console.log",
    python: "print",
    typescript: "console.log",
    java: "System.out.println",
    csharp: "Console.WriteLine",
    php: "echo",
  };

  for (let inputTestCase of inputTestCases) {
    const printFunction = languagePrintFunction[language];
    const printStatement =
      typeof inputTestCase === "string" ? `"${inputTestCase}"` : inputTestCase;
    const sourceCodeLine = `${sourceCode}\n${printFunction}(${functionName}(${printStatement}))`;
    sourceCodeArray.push(sourceCodeLine);
  }
  return sourceCodeArray;
};

export const getResponseAfterExecutingUserCode = async (
  language,
  sourceCode
) => {
  const langId = JUDGE0_LANGS_ID[language];
  const testInput = [TEST_CASES.inputTestCases[0]];

  const sourceCodeArray = appendSourceCodeBasedOnLanguageAndFunctionName(
    language,
    sourceCode,
    "firstCharacter",
    testInput
  );

  try {
    const submissionResponse = await axios.post(
      `${baseUrl}/execute_user_code`,
      {
        langId,
        sourceCode: sourceCodeArray[0],
        expected_output: TEST_CASES.outputTestCases[0],
        stdin: testInput[0],
      }
    );

    return submissionResponse.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error while executing user's code.");
  }
};

export const getResponseAfterSubmittingUserCode = async (
  language,
  sourceCode
) => {
  const langId = JUDGE0_LANGS_ID[language];
  const sourceCode1 = `${sourceCode}\nconsole.log(firstCharacter("${TEST_CASES.inputTestCases[0]}"))`;
  const sourceCode2 = `${sourceCode}\nconsole.log(firstCharacter("${TEST_CASES.inputTestCases[1]}"))`;

  try {
    const submissionResponse = await axios.post(`${baseUrl}/submit_user_code`, {
      submissions: [
        {
          language_id: langId,
          source_code: sourceCode1,
          expected_output: TEST_CASES.outputTestCases[0],
          stdin: TEST_CASES.inputTestCases[0],
        },
        {
          language_id: langId,
          source_code: sourceCode2,
          expected_output: TEST_CASES.outputTestCases[1],
          stdin: TEST_CASES.inputTestCases[1],
        },
      ],
    });

    return submissionResponse.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error while submitting user's code.");
  }
};
