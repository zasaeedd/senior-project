// "use client";

// import React from "react";

// interface QuestionFormProps {
//   index: number;
//   question: {
//     question: string;
//     options: string[];
//     correctAnswer: string;
//   };
//   onQuestionChange: (index: number, value: string) => void;
//   onOptionChange: (qIndex: number, optIndex: number, value: string) => void;
//   onCorrectAnswerChange: (qIndex: number, value: string) => void;
//   onRemove?: (index: number) => void;
// }

// const QuestionForm: React.FC<QuestionFormProps> = ({
//   index,
//   question,
//   onQuestionChange,
//   onOptionChange,
//   onCorrectAnswerChange,
//   onRemove,
// }) => {
//   return (
//     <div className="border p-4 rounded space-y-4">
//       {/* Question Text */}
//       <div>
//         <label className="block font-semibold mb-2">Question {index + 1}</label>
//         <input
//           type="text"
//           value={question.question}
//           onChange={(e) => onQuestionChange(index, e.target.value)}
//           className="border p-2 w-full rounded"
//           placeholder="Enter question text"
//         />
//       </div>

//       {/* Options */}
//       {question.options.map((opt, optIndex) => (
//         <div key={optIndex}>
//           <label className="block mb-1">
//             Option {String.fromCharCode(65 + optIndex)}
//           </label>
//           <input
//             type="text"
//             value={opt}
//             onChange={(e) => onOptionChange(index, optIndex, e.target.value)}
//             className="border p-2 w-full rounded"
//             placeholder={`Enter option ${String.fromCharCode(65 + optIndex)}`}
//           />
//         </div>
//       ))}

//       {/* Correct Answer Selector */}
//       <div>
//         <label className="block font-semibold mb-2">Correct Answer</label>
//         <select
//           value={question.correctAnswer}
//           onChange={(e) => onCorrectAnswerChange(index, e.target.value)}
//           className="border p-2 w-full rounded"
//         >
//           <option value="">Select correct answer</option>
//           {question.options.map((opt, optIndex) => (
//             <option key={optIndex} value={opt}>
//               {opt || `Option ${String.fromCharCode(65 + optIndex)}`}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Remove Question Button */}
//       {onRemove && (
//         <button
//           type="button"
//           onClick={() => onRemove(index)}
//           className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//         >
//           Remove Question
//         </button>
//       )}
//     </div>
//   );
// };

// export default QuestionForm;




interface Choice {
  text: string;
  is_correct: boolean;
}

interface Question {
  text: string;
  type: "mcq" | "written";
  points: number;
  difficulty: string;
  choices: Choice[];
}

interface QuestionFormProps {
  index: number;
  question: Question;
  onTextChange: (index: number, value: string) => void;
  onTypeChange: (index: number, value: string) => void;
  onPointsChange: (index: number, value: number) => void;
  onDifficultyChange: (index: number, value: string) => void;
  onChoiceTextChange: (qIndex: number, cIndex: number, value: string) => void;
  onCorrectChoiceChange: (qIndex: number, cIndex: number) => void;
  onAddChoice: (qIndex: number) => void;
  onRemove?: (index: number) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  index,
  question,
  onTextChange,
  onTypeChange,
  onPointsChange,
  onDifficultyChange,
  onChoiceTextChange,
  onCorrectChoiceChange,
  onAddChoice,
  onRemove,
}) => {
  return (
    <div className="border p-4 rounded space-y-4">
      <label className="block font-semibold mb-2">Question {index + 1}</label>
      <input
        type="text"
        value={question.text}
        onChange={(e) => onTextChange(index, e.target.value)}
        className="border p-2 w-full rounded"
        placeholder="Enter question"
      />

      {/* Type dropdown */}
      <select
        value={question.type}
        onChange={(e) => onTypeChange(index, e.target.value as "mcq" | "written")}
        className="border p-2 w-full rounded"
      >
        <option value="mcq">MCQ</option>
        <option value="written">Written</option>
      </select>

      {/* Points + Difficulty */}
      <label className="block font-semibold mb-2">Points</label>
      <input
        type="number"
        value={question.points}
        onChange={(e) => onPointsChange(index, Number(e.target.value))}
        placeholder="Points"
        className="border p-2 w-full rounded"
      />
      <input
        type="text"
        value={question.difficulty}
        onChange={(e) => onDifficultyChange(index, e.target.value)}
        placeholder="Difficulty (easy/medium/hard)"
        className="border p-2 w-full rounded"
      />

      {/* Choices only if MCQ */}
      {question.type === "mcq" && (
        <div>
          {question.choices.map((choice, cIndex) => (
            <div key={cIndex} className="flex  justify-between mb-4">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => onChoiceTextChange(index, cIndex, e.target.value)}
                placeholder={`Choice ${cIndex + 1}`}
                className="border p-2 rounded flex-1 mr-4"
              />
              <label className="flex items-center space-x-3">
              <input
                type="radio"
                name={`correct-${index}`}
                checked={choice.is_correct}
                onChange={() => onCorrectChoiceChange(index, cIndex)}
              />
                <span>Correct</span>
              </label>
            </div>
          ))}
          <button type="button" onClick={() => onAddChoice(index)}>
            + Add Choice
          </button>
        </div>
      )}

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