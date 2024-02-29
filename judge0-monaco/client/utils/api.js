import axios from "axios";
import { JUDGE0_LANGS_ID, TEST_CASES } from "./constants";

const baseUrl = "http://localhost:3000";

export const getResponseAfterExecutingUserCode = async (language, sourceCode) => {
  const langId = JUDGE0_LANGS_ID[language];
  const testInput = TEST_CASES.inputTestCases[0];

  if (language === "javascript") {
    sourceCode = `${sourceCode}\nconsole.log(firstCharacter("${testInput}"))`;
  } else if (language === "python") {
    sourceCode = `${sourceCode}\nprint(first_character("${testInput}"))`;
  }

  try {
    const submissionResponse = await axios.post(`${baseUrl}/execute_user_code`, {
      langId,
      sourceCode,
      expected_output: TEST_CASES.outputTestCases[0],
      stdin: testInput,
    });

    return submissionResponse.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error while executing user's code.");
  }
};

export const getResponseAfterSubmittingUserCode = async (language, sourceCode) => {
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
