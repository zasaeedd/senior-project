// "use client";

// import React, { useState } from "react";
// import QuestionForm from "@/components/ui/QuestionForm";

// interface Choice {
//   text: string;
//   is_correct: boolean;
// }

// interface Question {
//   text: string;
//   type: "mcq" | "written";
//   points: number;
//   difficulty: string;
//   choices: Choice[];
// }

// const CreateQuiz: React.FC = () => {
//   // Quiz-level state
//   const [title, setTitle] = useState("");
//   const [duration, setDuration] = useState(0);
//   const [deadline, setDeadline] = useState("");
//   const [courseCode, setCourseCode] = useState("");
//   const [sectionNumber, setSectionNumber] = useState("");

//   // Questions state
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       text: "",
//       type: "mcq",
//       points: 0,
//       difficulty: "easy",
//       choices: [
//         { text: "", is_correct: false },
//         { text: "", is_correct: false },
//       ],
//     },
//   ]);

//   // Handlers
//   const handleTextChange = (qIndex: number, value: string) => {
//     const updated = [...questions];
//     updated[qIndex].text = value;
//     setQuestions(updated);
//   };

//   const handleTypeChange = (qIndex: number, value: string) => {
//     const newType = value as "mcq" | "written";
//     const updated = [...questions];
//     updated[qIndex].type = newType;
//     if (newType === "written") {
//       updated[qIndex].choices = [];
//     } else {
//       updated[qIndex].choices = [
//         { text: "", is_correct: false },
//         { text: "", is_correct: false },
//       ];
//     }
//     setQuestions(updated);
//   };

//   const handlePointsChange = (qIndex: number, value: number) => {
//     const updated = [...questions];
//     updated[qIndex].points = value;
//     setQuestions(updated);
//   };

//   const handleDifficultyChange = (qIndex: number, value: string) => {
//     const updated = [...questions];
//     updated[qIndex].difficulty = value;
//     setQuestions(updated);
//   };

//   const handleChoiceTextChange = (
//     qIndex: number,
//     cIndex: number,
//     value: string,
//   ) => {
//     const updated = [...questions];
//     updated[qIndex].choices[cIndex].text = value;
//     setQuestions(updated);
//   };

//   const handleCorrectChoiceChange = (qIndex: number, cIndex: number) => {
//     const updated = [...questions];
//     updated[qIndex].choices.forEach((c, i) => (c.is_correct = i === cIndex));
//     setQuestions(updated);
//   };

// const handleAddChoice = (qIndex: number) => {
//   const updated = [...questions];
//   if (updated[qIndex].choices.length < 4) {
//     updated[qIndex].choices.push({ text: "", is_correct: false });
//     setQuestions(updated);
//   } else {
//     alert("You can only have up to 4 choices for an MCQ.");
//   }
// };

//   const handleRemoveQuestion = (qIndex: number) => {
//     const updated = questions.filter((_, i) => i !== qIndex);
//     setQuestions(updated);
//   };

//   // Submit handler
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       title,
//       duration,
//       deadline,
//       courseCode,
//       sectionNumber,
//       questions,
//     };

//     console.log("Quiz payload:", payload);

//     const token = localStorage.getItem("token");
//     const response = await fetch("http://localhost:5000/api/quiz/creation", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       alert(`Error creating quiz: ${errorText}`);
//       return;
//     }

//     alert("Quiz created successfully!");
//   };

//   return (
// <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
//   {/* Quiz Info */}
//   <div className="border p-4 rounded shadow space-y-4">
//     <h2 className="text-lg font-bold">Quiz Details</h2>
//     <input
//       type="text"
//       value={title}
//       onChange={(e) => setTitle(e.target.value)}
//       placeholder="Quiz Title"
//       className="border p-2 w-full rounded"
//     />
//      <label className="block font-semibold mb-2">Duration (minutes)</label>
//     <input
//       type="number"
//       value={duration}
//       onChange={(e) => setDuration(Number(e.target.value))}
//       placeholder="Duration (minutes)"
//       className="border p-2 w-full rounded"
//     />
//     <label className="block font-semibold mb-2">Deadline</label>
//     <input
//       type="date"
//       value={deadline}
//       onChange={(e) => setDeadline(e.target.value)}
//       className="border p-2 w-full rounded"
//     />
//     <label className="block font-semibold mb-2">Course ID</label>
//     <input
//       type="text"
//       value={courseCode}
//       onChange={(e) => setCourseCode(e.target.value)}
//       placeholder="Course Code (e.g. ITCS113)"
//       className="border p-2 w-full rounded"
//     />
//     <label className="block font-semibold mb-2">Section ID</label>
//     <input
//       type="text"
//       value={sectionNumber}
//       onChange={(e) => setSectionNumber(e.target.value)}
//       placeholder="Section Number"
//       className="border p-2 w-full rounded"
//     />
//   </div>

//   {/* Questions */}
//   <div className="space-y-4">
//     {questions.map((q, qIndex) => (
//       <QuestionForm
//         key={qIndex}
//         index={qIndex}
//         question={q}
//         onTextChange={handleTextChange}
//         onTypeChange={handleTypeChange}
//         onPointsChange={handlePointsChange}
//         onDifficultyChange={handleDifficultyChange}
//         onChoiceTextChange={handleChoiceTextChange}
//         onCorrectChoiceChange={handleCorrectChoiceChange}
//         onAddChoice={handleAddChoice}
//         onRemove={handleRemoveQuestion}
//       />
//     ))}
//   </div>

//   {/* Add Question Button */}
//   <button
//     type="button"
//     onClick={() =>
//       setQuestions([
//         ...questions,
//         {
//           text: "",
//           type: "mcq",
//           points: 0,
//           difficulty: "easy",
//           choices: [
//             { text: "", is_correct: false },
//             { text: "", is_correct: false }
//           ]
//         }
//       ])
//     }
//     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//   >
//     + Add Question
//   </button>

//   {/* Submit */}
//   <button
//     type="submit"
//     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//   >
//     Create Quiz
//   </button>
// </form>
//   );
// };

// export default CreateQuiz;















"use client";

import React, { useState, useEffect } from "react";
import QuestionForm from "@/components/ui/QuestionForm";
import { useRouter } from "next/navigation";


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

interface CreateQuizProps {
  onClose: () => void;
}

const CreateQuiz: React.FC<CreateQuizProps> = ({ onClose }) => {
  const router = useRouter();
  // Quiz-level state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [courseCode, setCourseCode] = useState("");
  // const [sectionNumber, setSectionNumber] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [maxAttempts, setmaxAttempt] = useState(1);
  

  // Dropdown data
  const [coursesSections, setCoursesSections] = useState<any[]>([]);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "mcq",
      points: 0,
      difficulty: "easy",
      choices: [
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  ]);

  // Fetch instructor’s courses + sections
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const res = await fetch(
        "http://localhost:5000/api/quiz/instructor/sections",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setCoursesSections(data);
    };
    fetchData();
  }, []);

  // Filter sections by selected course
  const filteredSections = coursesSections.filter(
    (sec) => sec.courseCode=== courseCode,
  );

  // Handlers for questions
  const handleTextChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].text = value;
    setQuestions(updated);
  };

  const handleTypeChange = (qIndex: number, value: string) => {
    const newType = value as "mcq" | "written";
    const updated = [...questions];
    updated[qIndex].type = newType;
    updated[qIndex].choices =
      newType === "written"
        ? []
        : [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ];
    setQuestions(updated);
  };

  const handlePointsChange = (qIndex: number, value: number) => {
    const updated = [...questions];
    updated[qIndex].points = value;
    setQuestions(updated);
  };

  const handleDifficultyChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].difficulty = value;
    setQuestions(updated);
  };

  const handleChoiceTextChange = (
    qIndex: number,
    cIndex: number,
    value: string,
  ) => {
    const updated = [...questions];
    updated[qIndex].choices[cIndex].text = value;
    setQuestions(updated);
  };

  const handleCorrectChoiceChange = (qIndex: number, cIndex: number) => {
    const updated = [...questions];
    updated[qIndex].choices.forEach((c, i) => (c.is_correct = i === cIndex));
    setQuestions(updated);
  };

  const handleAddChoice = (qIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].choices.length < 4) {
      updated[qIndex].choices.push({ text: "", is_correct: false });
      setQuestions(updated);
    } else {
      alert("You can only have up to 4 choices for an MCQ.");
    }
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const updated = questions.filter((_, i) => i !== qIndex);
    setQuestions(updated);
  };
  function getLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      duration,
      deadline,
      courseCode,      
      sectionNumbers : selectedSections, 
      maxAttempts,  
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

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error creating quiz: ${errorText}`);
      return;
    }

    alert("Quiz created successfully!");
    onClose(); 
};


  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Quiz Info */}
      <div className="border p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-bold">Quiz Details</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz Title"
          className="border p-2 w-full rounded"
        />

        <label className="block font-semibold mb-2">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          min={1}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (minutes)"
          className="border p-2 w-full rounded"
        />

        <label className="block font-semibold mb-2">Max Attempts:</label>
        <input
          type="number"
          name="maxAttempts"
          min="1"
          value={maxAttempts}
          onChange={(e)=> setmaxAttempt(Number(e.target.value))}
          className="border p-2 w-full rounded"
        />


        <label className="block font-semibold mb-2">Deadline:</label>
          <input
            type="datetime-local"
            value={deadline}
            min={new Date().toISOString().slice(0,16)} 
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 w-full rounded"
          />



        {/* Course Dropdown
        <label className="block font-semibold mb-2">Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Course</option>
          {coursesSections
            .map((section) => ({
              courseId: section.courseId,   
              courseCode: section.courseCode,
              courseName: section.courseName,
              sectionId: section.sectionId,
            }))
            .filter(
              (course, index, self) =>
                index === self.findIndex((c) => c.courseId === course.courseId),
            )
            .map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
        </select> */}


      
      <label className="block font-semibold mb-2">Course</label>
      <select
        value={courseCode}                     
        onChange={(e) => setCourseCode(e.target.value)}
        className="border p-2 w-full rounded"
      >
      <option value="">Select Course</option>
   {coursesSections
  .filter(
    (course, index, self) =>
      index === self.findIndex((c) => c.courseId === course.courseId),
  )
  .map((course) => (
    <option key={course.courseId} value={course.courseCode}>
      {course.courseCode} - {course.courseName}
    </option>
  ))}
    </select>



        {/* Section Dropdown
        <label className="block font-semibold mb-2">Section</label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          disabled={!courseId}
          className="border p-2 w-full rounded"
        >
          <option value="">Select Section</option>
          {filteredSections.map((sec) => (
            <option key={sec.sectionId} value={sec.sectionId}>
              Section {sec.sectionId}
            </option>
          ))}
        </select> */}


        {/* Section Dropdown */}
      {/* <label className="block font-semibold mb-2">Section</label>
      <select
      multiple
        value={selectedSections}                  
        onChange={(e) => setSelectedSections(
          Array.from(e.target.selectedOptions, (option) => option.value)
        )
        }
        
        disabled={!courseCode}
        className="border p-2 w-full rounded"
      >
        {filteredSections.map((sec) => (
          <option key={sec.sectionId} value={sec.sectionNumber}>
            Section {sec.sectionNumber}
          </option>
        ))}
      </select> */}

      <label className="block font-semibold mb-2">Sections</label>
<div className="space-y-2">
  {filteredSections.map((sec) => (
    <label key={sec.sectionId} className="flex items-center space-x-2">
      <input
        type="checkbox"
        value={sec.sectionNumber}
        checked={selectedSections.includes(String(sec.sectionNumber))}
        onChange={(e) => {
          const value = e.target.value;
          if (e.target.checked) {
            setSelectedSections([...selectedSections, value]);
          } else {
            setSelectedSections(selectedSections.filter((s) => s !== value));
          }
        }}
      />
      <span>Section {sec.sectionNumber}</span>
    </label>
  ))}
</div>

      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <QuestionForm
            key={qIndex}
            index={qIndex}
            question={q}
            onTextChange={handleTextChange}
            onTypeChange={handleTypeChange}
            onPointsChange={handlePointsChange}
            onDifficultyChange={handleDifficultyChange}
            onChoiceTextChange={handleChoiceTextChange}
            onCorrectChoiceChange={handleCorrectChoiceChange}
            onAddChoice={handleAddChoice}
            onRemove={handleRemoveQuestion}
          />
        ))}
      </div>

      {/* Add Question Button */}
      <button
        type="button"
        onClick={() =>
          setQuestions([
            ...questions,
            {
              text: "",
              type: "mcq",
              points: 0,
              difficulty: "easy",
              choices: [
                { text: "", is_correct: false },
                { text: "", is_correct: false },
              ],
            },
          ])
        }
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Add Question
      </button>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Create Quiz
      </button>
    </form>
  );
};


export default CreateQuiz;
