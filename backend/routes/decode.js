const express = require('express')
const router = express.Router()
const multer = require('multer')
const pdfParse = require('pdf-parse')
const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } //5mb
})

router.post('/', (req, res) => {
  upload.single('document')(req, res, async (err) => {
    
    if (err) {
      return res.status(400).json({ error: err.message })
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const pdfData = await pdfParse(req.file.buffer)
      const extractedText = pdfData.text

      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({ error: 'Could not extract text from this document' })
      }

      res.setHeader('Content-Type', 'text/plain')
      res.setHeader('Transfer-Encoding', 'chunked')

      const stream = await client.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are a legal document expert specialising in Indian law. 
                When given a document, you must respond in exactly this format:

                SUMMARY
                Write 3-5 sentences explaining what this document is and what it means for the person signing it. Use simple language any Indian adult can understand.

                RED FLAGS
                List any concerning clauses, unfair terms, or things the person should be worried about. If none, write "No major red flags found."

                QUESTIONS TO ASK
                List 3-5 questions the person should ask before signing this document.

                Keep everything simple. Avoid legal jargon.`,
        messages: [{ 
          role: 'user', 
          content: `Please analyse this document:\n\n${extractedText}` 
        }]
      })

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          res.write(chunk.delta.text)
        }
      }

      res.end()

    } catch (error) {
      console.error('Error:', error.message)
      if (!res.headersSent) {
        res.status(500).json({ error: 'Something went wrong. Please try again.' })
      } else {
        res.end()
      }
    }
  })
})

module.exports = router