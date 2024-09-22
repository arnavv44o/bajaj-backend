const express = require('express');
const app = express();
const mime = require('mime-types');
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

function decodeBase64File(base64Str) {
  try {
    const buffer = Buffer.from(base64Str, 'base64');
    return buffer;
  } catch (error) {
    return null;
  }
}

const cors = require('cors');
app.use(cors());


function generateResponse(data, file_b64) {
  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));
  const highestLowercaseAlphabet = alphabets.filter(char => /[a-z]/.test(char)).sort().pop() || null;

  let file_valid = false;
  let file_mime_type = null;
  let file_size_kb = null;

  if (file_b64) {
    const fileBuffer = decodeBase64File(file_b64);

    if (fileBuffer) {
      file_valid = true;
      file_size_kb = (fileBuffer.length / 1024).toFixed(2);
      file_mime_type = mime.lookup(fileBuffer) || "unknown";
    }
  }


const response = {
    is_success: true,
    user_id: "as0762",
    email: "as0762@srmist.edu.in",
    roll_number: "RA2111003010371",
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: file_valid,
    file_mime_type: file_mime_type,
    file_size_kb: file_size_kb
};

  return response;
}

function validatePostData(req, res, next) {
  const { data, file_b64 } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Data must be an array." });
  }

  if (file_b64 && typeof file_b64 !== 'string') {
    return res.status(400).json({ is_success: false, message: "file_b64 must be a base64 encoded string." });
  }

  next();
}

app.post('/bfhl', validatePostData, (req, res, next) => {
  try {
    const { data, file_b64 } = req.body;
    const response = generateResponse(data, file_b64);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.get('/bfhl', (req, res) => {
  const response = {
    operation_code: 1
  };

  return res.status(200).json(response);
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    is_success: false,
    message: 'Internal server error, please try again later.',
  });
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    message: 'Route not found.',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


