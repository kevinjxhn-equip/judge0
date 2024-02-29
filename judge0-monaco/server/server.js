import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(cors());

const judge0Api = axios.create({
  baseURL: "http://127.0.0.1:2358",
});

// Main function to run the app
async function initializeApp() {
  app.post("/run-code", async (req, res) => {
    const { langId, sourceCode, expected_output, stdin } = req.body;

    const data = {
      language_id: langId,
      source_code: sourceCode,
      stdin,
      expected_output,
    };

    try {
      const response = await judge0Api.post("/submissions", data);
      const token = response.data.token;

      let submissionResponse;
      do {
        submissionResponse = await judge0Api.get(`/submissions/${token}`);
        console.log(submissionResponse.data);

        if (submissionResponse.data.status.id <= 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } while (submissionResponse.data.status.id <= 2);

      res.json(submissionResponse.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/test-batch", async (req, res) => {
    const data = req.body;
    console.log(data);
    try {
      const response = await judge0Api.post("/submissions/batch", data);
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

  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}/`);
  });
}

initializeApp();
