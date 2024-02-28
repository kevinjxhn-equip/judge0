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
  baseURL: "https://judge0-ce.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
  },
});

// Main function to run the app
async function initializeApp() {
  app.post("/run-code", async (req, res) => {
    const { langId, sourceCode } = req.body;

    const data = {
      language_id: langId,
      source_code: sourceCode,
      expected_output: "Hello Raj",
    };

    try {
      const response = await judge0Api.post("/submissions", data);
      const token = response.data.token;

      let submissionResponse;
      do {
        submissionResponse = await judge0Api.get(`/submissions/${token}`);

        if (submissionResponse.data.status.id <= 2) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

      } while (submissionResponse.data.status.id <= 2);

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
