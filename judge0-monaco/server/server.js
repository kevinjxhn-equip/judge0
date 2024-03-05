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
  // Endpoint to execute user code
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

  // Endpoint to handle webhook notifications from Judge0 for user code execution
  app.put("/judge0_webhook_user_code_execution", (req, res) => {
    submissionResultData = decodeBase64(req.body);

    console.log("submissionResultData", submissionResultData);

    res.status(200).json({ message: "Webhook recieved successfully." });
  });

  // Endpoint to stream submission result data via SSE
  app.get("/judge0_webhook_user_code_execution", (req, res) => {
    if (submissionResultData) {
      res.status(200).json(submissionResultData); 
      submissionResultData = null; // Clear submission result data after sending
    } else {
      res.status(404).send("No submission result data available."); 
    }
  });

  // Endpoint to submit user code
  app.post("/submit_user_code", async (req, res) => {
    try {
      const response = await judge0Api.post("/submissions/batch", req.body);
      const tokens = response.data.map((item) => item.token).join(",");

      let submissionResponse;
      do {
        submissionResponse = await judge0Api.get(
          `/submissions/batch?tokens=${tokens}`
        );

        if (submissionResponse.data.submissions[0].status.id <= 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        console.log(submissionResponse.data.submissions[0].status);
      } while (
        submissionResponse.data.submissions.every((item) => item.status.id <= 2)
      );

      res.json(submissionResponse.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

initializeApp();
