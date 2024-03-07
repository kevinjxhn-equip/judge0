import axios from "axios";
import { JUDGE0_LANGS_ID } from "./constants";

const baseUrl = "http://localhost:3000";

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

// export const getResponseAfterExecutingUserCode = async (
//   language,
//   sourceCode
// ) => {
//   const langId = JUDGE0_LANGS_ID[language];
//   const testInput = [TEST_CASES.inputTestCases[0]];

//   const sourceCodeArray = appendSourceCodeBasedOnLanguageAndFunctionName(
//     language,
//     sourceCode,
//     language === "python" ? "first_character" : "firstCharacter",
//     testInput
//   );

//   try {
//     await axios.post(`${baseUrl}/execute_user_code`, {
//       langId,
//       sourceCode: sourceCodeArray[0],
//       expected_output: TEST_CASES.outputTestCases[0],
//       stdin: testInput[0],
//     });

//     return await pollForResult("judge0_webhook_user_code_execution");
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error while executing user's code.");
//   }
// };

export const getResponseAfterSubmittingUserCode = async (
  language,
  sourceCode
) => {
  const langId = JUDGE0_LANGS_ID[language];

  try {
    await axios.post(`${baseUrl}/submit_user_code`, {
      langId,
      sourceCode,
    });

    return await pollForResult("judge0_webhook_submit_user_code");
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

  if (!customInput) {
    return { errorId: 1, error: "Custom input is required" };
  }

  const sanitizedCustomInput = customInput.replace(/'/g, '"');

  try {
    JSON.parse(sanitizedCustomInput);
  } catch (error) {
    return { errorId: 2, error: "Invalid custom input format" };
  }

  try {
    await axios.post(`${baseUrl}/execute_user_code`, {
      langId,
      sourceCode,
      stdin: customInput,
    });

    return await pollForResult("judge0_webhook_user_code_execution");
  } catch (error) {
    console.log(error);
    throw new Error("Error while executing user's custom input code.");
  }
};
