const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", (req, res) => {
  upload.single("document")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded",
        });
      }

      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text;

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({
          error: "Could not extract text from this document",
        });
      }

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: `
                  You are a legal document expert specialising in Indian law.

                  Respond ONLY in valid JSON format like this:

                  {
                    "summary": "3-5 sentence explanation in simple language",
                    "redFlags": ["point 1", "point 2"],
                    "questions": ["question 1", "question 2"]
                  }

                  Rules:
                  - No extra text
                  - No markdown
                  - No explanation outside JSON
                  - Keep everything simple. Avoid legal jargon
                `,
        messages: [
          {
            role: "user",
            content: `Please analyse this document:\n\n${extractedText}`,
          },
        ],
      });

      const aiText = response.content?.[0]?.text;

      if (!aiText) {
        return res.status(500).json({
          error: "Empty response from AI",
        });
      }

      let parsedData;

      try {
        parsedData = JSON.parse(aiText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError.message);

        return res.status(500).json({
          error: "AI response format invalid",
          rawResponse: aiText,
        });
      }

      return res.status(200).json({
        success: true,
        data: parsedData,
      });
    } catch (error) {
      console.error("Server Error:", error.message);

      return res.status(500).json({
        error: "Something went wrong. Please try again.",
      });
    }
  });
});

module.exports = router;
