import axios from "axios";
import { JUDGE0_LANGS_ID, TEST_CASES } from "./constants";

const baseUrl = "http://localhost:3000";

export const executeCode = async (language, sourceCode) => {
  const langId = JUDGE0_LANGS_ID[language];
  const testInput = TEST_CASES.inputTestCases[0];

  if (language === "javascript") {
    sourceCode = `${sourceCode}\nconsole.log(firstCharacter("${testInput}"))`;
  } else if (language === "python") {
    sourceCode = `${sourceCode}\nprint(first_character("${testInput}"))`;
  }

  try {
    const submissionResponse = await axios.post(`${baseUrl}/run-code`, {
      langId,
      sourceCode,
      expected_output: TEST_CASES.outputTestCases[0],
      stdin: testInput,
    });

    return submissionResponse.data;
  } catch (error) {
    console.error(error);
    throw new Error("Error in the front end, we got a bad response.");
  }
};

export const apiToTestBatch = async (language, sourceCode) => {
  const language_id = JUDGE0_LANGS_ID[language];
  const source_code = sourceCode;

  try {
    const submissionResponse = await axios.post(`${baseUrl}/test-batch`, {
      submissions: [
        { language_id, source_code },
        { language_id, source_code },
      ],
    });

    console.log(submissionResponse.data);
  } catch (error) {
    console.log(error);
  }
};
