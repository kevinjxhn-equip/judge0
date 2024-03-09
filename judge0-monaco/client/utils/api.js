import axios from "axios";
import { JUDGE0_LANGS_ID } from "./constants";

const baseUrl = "http://localhost:3000";

const pollForResult = (serverUrl, userName) => {
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`${baseUrl}/${serverUrl}`, {
          params: { userName },
        });
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

export const getResponseAfterSubmittingUserCode = async (
  language,
  sourceCode,
  userName,
  functionName
) => {
  const langId = JUDGE0_LANGS_ID[language];

  try {
    await axios.post(`${baseUrl}/submit_user_code`, {
      langId,
      sourceCode,
      userName,
      functionName,
    });

    return await pollForResult("judge0_webhook_submit_user_code", userName);
  } catch (error) {
    console.log(error);
    throw new Error("Error while submitting user's code.");
  }
};

export const getResponseAfterExecutingUserCustomInputCode = async (
  language,
  sourceCode,
  customInput,
  userName,
  functionName
) => {
  const langId = JUDGE0_LANGS_ID[language];

  if (!customInput) {
    return { errorId: 1, error: "Custom input is required" };
  }

  try {
    await axios.post(`${baseUrl}/execute_user_code`, {
      langId,
      sourceCode,
      stdin: customInput,
      userName,
      functionName,
    });

    return await pollForResult("judge0_webhook_user_code_execution", userName);
  } catch (error) {
    console.log(error);
    throw new Error("Error while executing user's custom input code.");
  }
};
