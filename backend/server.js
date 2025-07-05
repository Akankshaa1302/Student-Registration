const express = require('express');
const cors = require('cors');
const multer = require('multer');
const supabase = require('./supabaseClient');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Allow CORS                                                               
app.use(cors());
app.use(express.json());

// Multer setup (for file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle form submission
app.post('/submit', upload.single('resume'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      collegeName,
      course,
      specialization,
      phone
    } = req.body;

    const file = req.file;

    // Upload resume to Supabase Storage
    const fileName = `${Date.now()}_${file.originalname}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError) throw storageError;

    const publicUrlResponse = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Save form data and resume URL to Supabase table
    const { data, error } = await supabase
      .from('student_forms')
      .insert([{
            firstname: firstName,
            lastname: lastName,
            dob,
            collegename: collegeName,
            course,
            specialization,
            phone,
            resumeurl: publicUrlResponse.data.publicUrl,
      }]);

    if (error) throw error;

    res.status(200).json({ message: 'Form submitted successfully', data });

  } catch (err) {
    console.error('Error submitting form:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
