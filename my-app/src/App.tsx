import React, { useState } from "react";
import "./App.css";

type FormData = {
  firstName: string;
  lastName: string;
  dob: string;
  resume: File | null;
  collegeName: string;
  course: string;
  specialization: string;
  phone: string;
};

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dob: "",
    resume: null,
    collegeName: "",
    course: "",
    specialization: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
    console.log("the file uploaded", file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
  const form = new FormData();
  form.append('firstName', formData.firstName);
  form.append('lastName', formData.lastName);
  form.append('dob', formData.dob);
  form.append('resume', formData.resume as File);
  form.append('collegeName', formData.collegeName);
  form.append('course', formData.course);
  form.append('specialization', formData.specialization);
  form.append('phone', formData.phone);

  try {
    const response = await fetch('${process.env.REACT_APP_API_URL}/submit', {
      method: 'POST',
      body: form,
    });

    const result = await response.json();
    console.log(result);
    alert('Form submitted successfully!');
  setFormData({
    firstName: "",
    lastName: "",
    dob: "",
    resume: null,
    collegeName: "",
    course: "",
    specialization: "",
    phone: "",
  });
  } catch (err) {
    console.error(err);
    alert('Failed to submit form');
  }
};

  return (
    <div className="container">
      <h2>Student Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="resume"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          required
        />
        {formData.resume && (
          <p style={{ fontSize: "14px", color: "#555" }}>
            Selected File: <strong>{formData.resume.name}</strong>
          </p>
        )}

        <input
          type="text"
          name="collegeName"
          placeholder="College Name"
          value={formData.collegeName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
