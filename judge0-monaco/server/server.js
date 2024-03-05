import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

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

// Function to decode base64 data from Judge0
const decodeBase64 = (data) => {
  const decodedData = {};
  for (const key in data) {
    if (typeof data[key] === "string" && data[key].trim().endsWith("=")) {
      try {
        decodedData[key] = Buffer.from(data[key], "base64").toString("utf-8");
      } catch (error) {
        // If decoding fails, keep the original value
        decodedData[key] = data[key];
      }
    } else {
      decodedData[key] = data[key];
    }
  }
  return decodedData;
};

// Main function to run the app
async function initializeApp() {
  app.post("/execute_user_code", async (req, res) => {
    const { langId, sourceCode, expected_output, stdin } = req.body;

    const data = {
      language_id: langId,
      source_code: sourceCode,
      callback_url: `http://host.docker.internal:${port}/judge0_webhook_user_code_execution`,
      stdin,
      expected_output,
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

    console.log("submissionResultData", submissionResultData);

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  app.get("/judge0_webhook_user_code_execution", (req, res) => {
    if (submissionResultData) {
      res.status(200).json(submissionResultData);
      submissionResultData = null;
    } else {
      res.status(404).send("No submission result data available.");
    }
  });

  app.post("/submit_user_code", async (req, res) => {
    const updatedRequestBody = {
      submissions: req.body.submissions.map((submission) => ({
        ...submission,
        callback_url: `http://host.docker.internal:${port}/judge0_webhook_submit_user_code`,
      })),
    };

    try {
      await judge0Api.post("/submissions/batch", updatedRequestBody);

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

    console.log("Received object:", decodedSubmissionResultData);

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  app.get("/judge0_webhook_submit_user_code", (req, res) => {
    if (batchSubmissionResultDataList.length > 0) {
      res.status(200).json(batchSubmissionResultDataList);
      batchSubmissionResultDataList = [];
    } else {
      res.status(404).send("No submission result data available.");
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

initializeApp();
