import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import {
  decodeBase64,
  sortByToken,
  appendBoilerPlateToSourceCode,
} from "./helpers.js";
import { questions } from "../judge0-monaco/client/utils/questions.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "30mb" }));

// Judge0 API instance
// const judge0Api = axios.create({
//   baseURL: "http://127.0.0.1:2358",
// });

const judge0Api = axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
  },
});

const userCustomSubmissionResultMap = new Map();
const batchSubmissionResultDataMap = new Map();
const userTokenDataMap = new Map();

// Main function to run the app
async function initializeApp() {
  // Route for executing user code
  app.post("/execute_user_code", async (req, res) => {
    const { langId, sourceCode, stdin, userName } = req.body;
    let { functionName } = req.body;

    const appendedSourceCode = appendBoilerPlateToSourceCode(
      sourceCode,
      functionName,
      langId
    );

    const data = {
      language_id: langId,
      source_code: appendedSourceCode,
      callback_url: `https://judge0-backend.onrender.com/judge0_webhook_user_code_execution?userName=${userName}`,
      // callback_url: `http://host.docker.internal:${port}/judge0_webhook_user_code_execution/?userName=${userName}`,
      stdin,
    };

    try {
      userCustomSubmissionResultMap.set(userName, null);

      await judge0Api.post("/submissions", data);

      res
        .status(200)
        .json({ message: "User code execution started successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route for handling webhook from Judge0 after user code execution
  app.put("/judge0_webhook_user_code_execution/", (req, res) => {
    const { userName } = req.query;

    userCustomSubmissionResultMap.set(userName, decodeBase64(req.body));

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  // Route to get the result of user code execution
  app.get("/judge0_webhook_user_code_execution", (req, res) => {
    const { userName } = req.query;

    try {
      const submissionResultData = userCustomSubmissionResultMap.get(userName);

      if (submissionResultData) {
        res.status(200).json(submissionResultData);
        userCustomSubmissionResultMap.delete(userName);
      } else {
        res.status(204).send("No submission result data available.");
      }
    } catch (error) {
      res.status(500).send("An error occurred while processing the request.");
    }
  });

  // Route to submit user code against sample test cases
  app.post("/submit_user_code", async (req, res) => {
    const { langId, sourceCode, userName } = req.body;
    let { functionName } = req.body;

    const appendedSourceCode = appendBoilerPlateToSourceCode(
      sourceCode,
      functionName,
      langId
    );

    let question;
    if (functionName === "firstCharacter") {
      question = questions[0];
    } else if (functionName === "calculateMatrixAverage") {
      question = questions[1];
    }

    const submissions = question.sampleTestcases.inputTestCases.map(
      (input, index) => ({
        language_id: langId,
        source_code: appendedSourceCode,
        expected_output: question.sampleTestcases.outputTestCases[index],
        stdin: input,
        callback_url: `https://judge0-backend.onrender.com/judge0_webhook_submit_user_code/?userName=${userName}`,
        // callback_url: `http://host.docker.internal:${port}/judge0_webhook_submit_user_code/?userName=${userName}`,
      })
    );

    try {
      const response = await judge0Api.post("/submissions/batch", {
        submissions,
      });

      const responseTokenData = response.data;
      userTokenDataMap.set(userName, responseTokenData);

      res
        .status(200)
        .json({ message: "User code execution started successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to handle webhook from Judge0 after submitting user code
  app.put("/judge0_webhook_submit_user_code", (req, res) => {
    const { userName } = req.query;
    const decodedSubmissionResultData = decodeBase64(req.body);

    if (!batchSubmissionResultDataMap.has(userName)) {
      batchSubmissionResultDataMap.set(userName, []);
    }

    batchSubmissionResultDataMap
      .get(userName)
      .push(decodedSubmissionResultData);

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  // Route to get the result of user code submission
  app.get("/judge0_webhook_submit_user_code", (req, res) => {
    const { userName } = req.query;

    try {
      const batchSubmissionResultDataList =
        batchSubmissionResultDataMap.get(userName);
      const responseTokenData = userTokenDataMap.get(userName);

      if (
        batchSubmissionResultDataList &&
        batchSubmissionResultDataList.length > 0 &&
        responseTokenData
      ) {
        const sortedData = sortByToken(
          responseTokenData,
          batchSubmissionResultDataList
        );
        res.status(200).json(sortedData);

        // Remove the token data associated with the user
        userTokenDataMap.delete(userName);
        batchSubmissionResultDataMap.delete(userName);
      } else {
        res.status(204).send("No submission result data available.");
      }
    } catch (error) {
      res.status(500).send("An error occurred while processing the request.");
      userTokenDataMap.delete(userName);
      batchSubmissionResultDataMap.delete(userName);
    }
  });

  // Route to submit user code against real test cases
  app.post("/submit_user_code_real_test_cases", async (req, res) => {
    const { langId, sourceCode, userName } = req.body;
    let { functionName } = req.body;

    const appendedSourceCode = appendBoilerPlateToSourceCode(
      sourceCode,
      functionName,
      langId
    );

    let question;
    if (functionName === "firstCharacter") {
      question = questions[0];
    } else if (functionName === "calculateMatrixAverage") {
      question = questions[1];
    }

    const submissions = question.realTestCases.inputTestCases.map(
      (input, index) => ({
        language_id: langId,
        source_code: appendedSourceCode,
        expected_output: question.realTestCases.outputTestCases[index],
        stdin: input,
        callback_url: `https://judge0-backend.onrender.com/judge0_webhook_submit_user_code_real_test_cases?userName=${userName}`,
        // callback_url: `http://host.docker.internal:${port}/judge0_webhook_submit_user_code_real_test_cases?userName=${userName}`,
      })
    );

    try {
      const response = await judge0Api.post("/submissions/batch", {
        submissions,
      });

      const responseTokenData = response.data;
      userTokenDataMap.set(userName, responseTokenData);

      res
        .status(200)
        .json({ message: "User code execution started successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route to handle webhook from Judge0 after submitting user code against real test cases
  app.put("/judge0_webhook_submit_user_code_real_test_cases", (req, res) => {
    const { userName } = req.query;
    const decodedSubmissionResultData = decodeBase64(req.body);

    if (!batchSubmissionResultDataMap.has(userName)) {
      batchSubmissionResultDataMap.set(userName, []);
    }

    batchSubmissionResultDataMap
      .get(userName)
      .push(decodedSubmissionResultData);

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  // Route to get the result of user code submission
  app.get("/judge0_webhook_submit_user_code_real_test_cases", (req, res) => {
    const { userName } = req.query;

    try {
      const batchSubmissionResultDataList =
        batchSubmissionResultDataMap.get(userName);
      const responseTokenData = userTokenDataMap.get(userName);

      if (
        batchSubmissionResultDataList &&
        batchSubmissionResultDataList.length > 0 &&
        responseTokenData
      ) {
        const sortedData = sortByToken(
          responseTokenData,
          batchSubmissionResultDataList
        );
        res.status(200).json(sortedData);

        // Remove the token data associated with the user
        userTokenDataMap.delete(userName);
        batchSubmissionResultDataMap.delete(userName);
      } else {
        res.status(204).send("No submission result data available.");
      }
    } catch (error) {
      res.status(500).send("An error occurred while processing the request.");
      userTokenDataMap.delete(userName);
      batchSubmissionResultDataMap.delete(userName);
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

initializeApp();
