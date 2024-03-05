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

  const languagePrintFunction = {
    javascript: "console.log",
    python: "print",
    typescript: "console.log",
    java: "System.out.println",
    csharp: "Console.WriteLine",
    php: "echo",
  };

  const serializeArgument = (arg) => {
    if (typeof arg === "string") return `"${arg}"`;
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

// Polling function to repeatedly check for response
const pollForResult = (serverUrl) => {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${baseUrl}/${serverUrl}`);
        if (response.status === 200) {
          clearInterval(pollInterval); // Stop polling
          resolve(response.data); // Resolve with submission result data
        } else {
          console.log("Polling: Response status not 200");
        }
      } catch (error) {
        console.error("Polling: Error occurred", error);
        clearInterval(pollInterval); // Stop polling on error
        reject(error);
      }
    }, 3000); // Poll every 3 seconds
  });
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
    language === "python" ? "first_character" : "firstCharacter",
    testInput
  );

  try {
    await axios.post(`${baseUrl}/execute_user_code`, {
      langId,
      sourceCode: sourceCodeArray[0],
      expected_output: TEST_CASES.outputTestCases[0],
      stdin: testInput[0],
    });

    return await pollForResult('judge0_webhook_user_code_execution');

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

  const sourceCodeArray = appendSourceCodeBasedOnLanguageAndFunctionName(
    language,
    sourceCode,
    language === "python" ? "first_character" : "firstCharacter",
    TEST_CASES.inputTestCases
  );
  const submissions = sourceCodeArray.map((sourceCode, index) => ({
    language_id: langId,
    source_code: sourceCode,
    expected_output: TEST_CASES.outputTestCases[index],
    stdin: TEST_CASES.inputTestCases[index],
  }));

  try {
    await axios.post(`${baseUrl}/submit_user_code`, {
      submissions: submissions,
    });

    return await pollForResult('judge0_webhook_submit_user_code');
  } catch (error) {
    console.log(error);
    throw new Error("Error while submitting user's code.");
  }
};

export const getResponseAfterExecutingUserCustomInputCode = async (
  language,
  sourceCode,
  customInput
) => {
  const langId = JUDGE0_LANGS_ID[language];

  console.log(typeof customInput, customInput);

  // We need it in the form of an array
  let formattedCustomInput = [customInput];

  try {
    formattedCustomInput = JSON.parse(customInput);
  } catch (error) {
    console.error("Error parsing custom input, caught", error);
    return { error: "Invalid custom input format" };
  }

  const sourceCodeArray = appendSourceCodeBasedOnLanguageAndFunctionName(
    language,
    sourceCode,
    language === "python" ? "first_character" : "firstCharacter",
    formattedCustomInput
  );

  try {
    const submissionResponse = await axios.post(
      `${baseUrl}/execute_user_code`,
      {
        langId,
        sourceCode: sourceCodeArray[0],
        stdin: customInput,
      }
    );

    return submissionResponse.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error while executing user's custom input code.");
  }
};
