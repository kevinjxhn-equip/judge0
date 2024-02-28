import axios from "axios";
import { JUDGE0_LANGS_ID } from "./constants";

const baseUrl = "http://localhost:3000";

export const executeCode = async (language, sourceCode) => {
    const langId = JUDGE0_LANGS_ID[language];

    try {
      const submissionResponse = await axios.post(`${baseUrl}/run-code`, {
        langId,
        sourceCode,
      });

      return submissionResponse.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error while sending code to server. Please try again.");
    }
};
