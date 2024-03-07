import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";
import { TEST_CASES } from "./constants.js";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const judge0Api = axios.create({
  baseURL: "http://127.0.0.1:2358",
});

let submissionResultData = null;
let batchSubmissionResultDataList = [];
let responseTokenData = null;

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

function sortByToken(tokenData, dataToSort) {
  return dataToSort.sort((a, b) => {
    const tokenA = tokenData.findIndex(
      (tokenObj) => tokenObj.token === a.token
    );
    const tokenB = tokenData.findIndex(
      (tokenObj) => tokenObj.token === b.token
    );
    return tokenA - tokenB;
  });
}

const appendSourceCodeBasedOnLanguageAndFunctionName = (
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

    console.log(args)
    const sourceCodeLine = `${sourceCode}\n${printFunction}(${functionName}(${args.join(
      ", "
    )}))`;
    sourceCodeArray.push(sourceCodeLine);
  }
  return sourceCodeArray;
};

// Main function to run the app
async function initializeApp() {
  app.post("/execute_user_code", async (req, res) => {
    const { langId, sourceCode, stdin } = req.body;

    const sourceCodeArray = appendSourceCodeBasedOnLanguageAndFunctionName(
      langId,
      sourceCode,
      langId === "71" ? "first_character" : "firstCharacter",
      stdin
    );

    const data = {
      language_id: langId,
      source_code: sourceCodeArray[0],
      callback_url: `http://host.docker.internal:${port}/judge0_webhook_user_code_execution`,
      stdin,
    };

    try {
      await judge0Api.post("/submissions", data);

      res
        .status(200)
        .json({ message: "User code execution started successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/judge0_webhook_user_code_execution", (req, res) => {
    submissionResultData = decodeBase64(req.body);

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  app.get("/judge0_webhook_user_code_execution", (req, res) => {
    if (submissionResultData) {
      res.status(200).json(submissionResultData);
      submissionResultData = null;
    } else {
      res.status(404).send("No submission result data available.");
      submissionResultData = null;
    }
  });

  app.post("/submit_user_code", async (req, res) => {
    const { langId, sourceCode } = req.body;

    const sourceCodeArray = appendSourceCodeBasedOnLanguageAndFunctionName(
      langId,
      sourceCode,
      langId === "71" ? "first_character" : "firstCharacter",
      TEST_CASES.inputTestCases
    );

    const submissions = sourceCodeArray.map((sourceCode, index) => ({
      language_id: langId,
      source_code: sourceCode,
      expected_output: TEST_CASES.outputTestCases[index],
      stdin: TEST_CASES.inputTestCases[index],
      callback_url: `http://host.docker.internal:${port}/judge0_webhook_submit_user_code`,
    }));


    try {
      const response = await judge0Api.post("/submissions/batch", {
        submissions,
      });

      responseTokenData = response.data;

      res
        .status(200)
        .json({ message: "User code execution started successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/judge0_webhook_submit_user_code", (req, res) => {
    const decodedSubmissionResultData = decodeBase64(req.body);
    batchSubmissionResultDataList.push(decodedSubmissionResultData); // Push received object into the array


    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  app.get("/judge0_webhook_submit_user_code", (req, res) => {
    if (batchSubmissionResultDataList.length > 0) {
      const sortedData = sortByToken(
        responseTokenData,
        batchSubmissionResultDataList
      );

      res.status(200).json(sortedData);
      batchSubmissionResultDataList = [];
    } else {
      res.status(404).send("No submission result data available.");
      batchSubmissionResultDataList = [];
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

initializeApp();
