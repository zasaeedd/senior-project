"use client";

import React, { useState } from "react";
import QuestionForm from "@/components/ui/QuestionForm";

const CreateQuiz: React.FC = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  // Handlers
  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      questions,
    };

    console.log("Quiz payload:", payload);

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/quiz/creation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok){
        alert("Quiz created successfully!");
        // reset form if you want
        setTitle("");
        setQuestions([{ question: "", options: [" "," "," "," "], correctAnswer: ""}]);
    }
    else {
  const errorText = await response.text();
  console.error("Backend error:", errorText);
  alert(`Error creating quiz: ${errorText}`);
  return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded">
      {/* Quiz Title */}
      <div>
        <label className="block font-semibold mb-2">Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Enter quiz title"
        />
      </div>

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <QuestionForm
          key={qIndex}
          index={qIndex}
          question={q}
          onQuestionChange={handleQuestionChange}
          onOptionChange={handleOptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
          onRemove={handleRemoveQuestion}
        />
      ))}

      {/* Add Question Button */}
      <button
        type="button"
        onClick={handleAddQuestion}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Question
      </button>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Quiz
        
      </button>
    </form>
  );
};

export default CreateQuiz;