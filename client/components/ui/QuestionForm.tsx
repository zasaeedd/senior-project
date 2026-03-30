"use client";

import React from "react";

interface QuestionFormProps {
  index: number;
  question: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onQuestionChange: (index: number, value: string) => void;
  onOptionChange: (qIndex: number, optIndex: number, value: string) => void;
  onCorrectAnswerChange: (qIndex: number, value: string) => void;
  onRemove?: (index: number) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  index,
  question,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswerChange,
  onRemove,
}) => {
  return (
    <div className="border p-4 rounded space-y-4">
      {/* Question Text */}
      <div>
        <label className="block font-semibold mb-2">Question {index + 1}</label>
        <input
          type="text"
          value={question.question}
          onChange={(e) => onQuestionChange(index, e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="Enter question text"
        />
      </div>

      {/* Options */}
      {question.options.map((opt, optIndex) => (
        <div key={optIndex}>
          <label className="block mb-1">
            Option {String.fromCharCode(65 + optIndex)}
          </label>
          <input
            type="text"
            value={opt}
            onChange={(e) => onOptionChange(index, optIndex, e.target.value)}
            className="border p-2 w-full rounded"
            placeholder={`Enter option ${String.fromCharCode(65 + optIndex)}`}
          />
        </div>
      ))}

      {/* Correct Answer Selector */}
      <div>
        <label className="block font-semibold mb-2">Correct Answer</label>
        <select
          value={question.correctAnswer}
          onChange={(e) => onCorrectAnswerChange(index, e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select correct answer</option>
          {question.options.map((opt, optIndex) => (
            <option key={optIndex} value={opt}>
              {opt || `Option ${String.fromCharCode(65 + optIndex)}`}
            </option>
          ))}
        </select>
      </div>

      {/* Remove Question Button */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Remove Question
        </button>
      )}
    </div>
  );
};

export default QuestionForm;