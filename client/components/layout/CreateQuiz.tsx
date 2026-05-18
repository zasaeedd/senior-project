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
import FileUploader, {
  type GeneratedQuizDraft as UploadedQuizDraft,
} from "./FileUploader";
import { supabase } from "@/supabaseClient";

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

type GeneratedQuizDraft = {
  title: string;
  questions: Question[];
};

function getDefaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// const CreateQuiz: React.FC<CreateQuizProps> = ({ onClose }) => {
//   function FileUploader() {
//     useEffect(() => {
//       const checkUser = async () => {
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();
//         console.log("Current user:", user);
//       };

//       checkUser();
//     }, []);

//     return <div>Uploader goes here</div>;
//   }

const CreateQuiz: React.FC<CreateQuizProps> = ({ onClose }) => {
  const router = useRouter();
  // Quiz-level state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [courseCode, setCourseCode] = useState("");
  // const [sectionNumber, setSectionNumber] = useState("");
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [maxAttempts, setmaxAttempt] = useState(1);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuizDraft | null>(
    null,
  );
  const [isProcessingAiFile, setIsProcessingAiFile] = useState(false);

  // Dropdown data
  const [coursesSections, setCoursesSections] = useState<any[]>([]);
  const filteredSections = courseCode
    ? coursesSections.filter((course) => course.courseCode === courseCode)
    : [];

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
      // localStorage.setItem("token", data.token);

      // Set Supabase session with tokens
      await supabase.auth.setSession({
        access_token: data.supabaseAccessToken,
        refresh_token: data.supabaseRefreshToken,
      });
    };
    fetchData();
  }, []);

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

  const handleGeneratedQuiz = (draft: UploadedQuizDraft) => {
    const normalizedQuestions: Question[] = draft.questions.map((question) => ({
      text: question.text,
      type: question.type,
      points: question.points,
      difficulty: question.difficulty,
      choices:
        question.type === "mcq"
          ? question.choices?.length
            ? question.choices.map((choice) => ({
                text: choice.text,
                is_correct: choice.is_correct,
              }))
            : [
                { text: "", is_correct: false },
                { text: "", is_correct: false },
                { text: "", is_correct: false },
                { text: "", is_correct: false },
              ]
          : [],
    }));

    const normalizedDraft: GeneratedQuizDraft = {
      title: draft.title,
      questions: normalizedQuestions,
    };

    setGeneratedQuiz(normalizedDraft);
    setQuestions(normalizedQuestions);
    if (!title && draft.title) {
      setTitle(draft.title);
    }
    if (!duration) {
      setDuration(15);
    }
    if (!deadline) {
      setDeadline(getDefaultDeadline());
    }
  };
  // function getLocalDateString() {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, "0");
  //   const day = String(today.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveQuestions =
      activeTab === "ai" && generatedQuiz?.questions?.length
        ? generatedQuiz.questions
        : questions;

    const effectiveTitle = title || generatedQuiz?.title || "";
    const effectiveDuration = duration || 15;
    const effectiveDeadline = deadline || getDefaultDeadline();

    if (activeTab === "ai" && !generatedQuiz) {
      alert(
        "Upload a file and wait for the AI quiz draft to finish generating first.",
      );
      return;
    }

    if (!effectiveTitle || !courseCode || selectedSections.length === 0) {
      alert(
        "Please fill the quiz title, choose a course, and select at least one section.",
      );
      return;
    }

    const payload = {
      title: effectiveTitle,
      duration: effectiveDuration,
      deadline: effectiveDeadline,
      courseCode,
      sectionNumbers: selectedSections,
      maxAttempts,
      questions: effectiveQuestions,
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
    console.log("Auth header:", `Bearer ${token}`);

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error creating quiz: ${errorText}`);
      return;
    }

    alert("Quiz created successfully!");
    onClose();
  };

  const [activeTab, setActiveTab] = useState<"manual" | "ai">("manual");

  //   return (
  //     <div className="p-4">
  //       <form onSubmit={handleSubmit} className="space-y-6">
  //         {/* Tab buttons */}
  //         <div className="flex space-x-4 mb-4">
  //           <button
  //             type="button"
  //             className={`px-4 py-2 rounded ${
  //               activeTab === "manual" ? "bg-blue-500 text-white" : "bg-gray-200"
  //             }`}
  //             onClick={() => setActiveTab("manual")}
  //           >
  //             Manual Quiz
  //           </button>
  //           <button
  //             type="button"
  //             className={`px-4 py-2 rounded ${
  //               activeTab === "ai" ? "bg-blue-500 text-white" : "bg-gray-200"
  //             }`}
  //             onClick={() => setActiveTab("ai")}
  //           >
  //             AI Quiz
  //           </button>
  //         </div>

  //         {/* Shared Quiz Info — always visible */}
  //         <div className="border p-4 rounded shadow space-y-4">
  //           <h2 className="text-lg font-bold">Quiz Details</h2>

  //           <input
  //             type="text"
  //             value={title}
  //             onChange={(e) => setTitle(e.target.value)}
  //             placeholder="Quiz Title"
  //             className="border p-2 w-full rounded"
  //           />

  //           <label className="block font-semibold mb-2">Duration (minutes)</label>
  //           <input
  //             type="number"
  //             value={duration}
  //             min={1}
  //             onChange={(e) => setDuration(Number(e.target.value))}
  //             placeholder="Duration (minutes)"
  //             className="border p-2 w-full rounded"
  //           />

  //           <label className="block font-semibold mb-2">Max Attempts:</label>
  //           <input
  //             type="number"
  //             name="maxAttempts"
  //             min="1"
  //             value={maxAttempts}
  //             onChange={(e) => setmaxAttempt(Number(e.target.value))}
  //             className="border p-2 w-full rounded"
  //           />

  //           <label className="block font-semibold mb-2">Deadline:</label>
  //           <input
  //             type="datetime-local"
  //             value={deadline}
  //             min={new Date().toISOString().slice(0, 16)}
  //             onChange={(e) => setDeadline(e.target.value)}
  //             className="border p-2 w-full rounded"
  //           />

  //           <label className="block font-semibold mb-2">Course</label>
  //           <select
  //             value={courseCode}
  //             onChange={(e) => setCourseCode(e.target.value)}
  //             className="border p-2 w-full rounded"
  //           >
  //             <option value="">Select Course</option>
  //             {coursesSections
  //               .filter(
  //                 (course, index, self) =>
  //                   index ===
  //                   self.findIndex((c) => c.courseId === course.courseId),
  //               )
  //               .map((course) => (
  //                 <option key={course.courseId} value={course.courseCode}>
  //                   {course.courseCode} - {course.courseName}
  //                 </option>
  //               ))}
  //           </select>

  //           <label className="block font-semibold mb-2">Sections</label>
  //           <div className="space-y-2">
  //             {filteredSections.map((sec) => (
  //               <label
  //                 key={sec.sectionId}
  //                 className="flex items-center space-x-2"
  //               >
  //                 <input
  //   type="checkbox"
  //   value={sec.sectionNumber}
  //   checked={selectedSections.includes(sec.sectionNumber)}
  //   onChange={(e) => {
  //     const value = Number(e.target.value);
  //     if (e.target.checked) {
  //       setSelectedSections([...selectedSections, value]);
  //     } else {
  //       setSelectedSections(selectedSections.filter((s) => s !== value));
  //     }
  //   }}
  // />
  //                 <span>Section {sec.sectionNumber}</span>
  //               </label>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Tab-specific content */}
  //         {activeTab === "manual" && (
  //           <>
  //             {/* Questions */}
  //             <div className="space-y-4">
  //               {questions.map((q, qIndex) => (
  //                 <QuestionForm
  //                   key={qIndex}
  //                   index={qIndex}
  //                   question={q}
  //                   onTextChange={handleTextChange}
  //                   onTypeChange={handleTypeChange}
  //                   onPointsChange={handlePointsChange}
  //                   onDifficultyChange={handleDifficultyChange}
  //                   onChoiceTextChange={handleChoiceTextChange}
  //                   onCorrectChoiceChange={handleCorrectChoiceChange}
  //                   onAddChoice={handleAddChoice}
  //                   onRemove={handleRemoveQuestion}
  //                 />
  //               ))}
  //             </div>

  //             {/* Add Question Button */}
  //             <button
  //               type="button"
  //               onClick={() =>
  //                 setQuestions([
  //                   ...questions,
  //                   {
  //                     text: "",
  //                     type: "mcq",
  //                     points: 0,
  //                     difficulty: "easy",
  //                     choices: [
  //                       { text: "", is_correct: false },
  //                       { text: "", is_correct: false },
  //                     ],
  //                   },
  //                 ])
  //               }
  //               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  //             >
  //               + Add Question
  //             </button>
  //           </>
  //         )}

  //         {activeTab === "ai" && (
  //           <>
  //             <h2 className="text-lg font-bold">AI Quiz Generator</h2>
  //             <FileUploader />
  //           </>
  //         )}

  //         {/* Shared submit button */}
  //         <button
  //           type="submit"
  //           className="bg-green-500 text-white px-4 py-2 rounded"
  //         >
  //           Create Quiz
  //         </button>
  //       </form>
  //     </div>
  //   );
  // };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-4">Create Quiz</h1>

          {/* Tabs (modern toggle style) */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("manual")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "manual"
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Manual
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ai")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "ai"
                  ? "bg-white shadow text-blue-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              AI Generator
            </button>
          </div>
        </div>

        {/* QUIZ INFO CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h2 className="font-semibold text-slate-700">Quiz Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz Title"
              className="border border-slate-200 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Duration + Attempts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                min={1}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="border border-slate-200 p-2 w-full rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Max Attempts
              </label>
              <input
                title="attempts"
                type="number"
                min="1"
                value={maxAttempts}
                onChange={(e) => setmaxAttempt(Number(e.target.value))}
                className="border border-slate-200 p-2 w-full rounded-lg"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={deadline}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setDeadline(e.target.value)}
              className="border border-slate-200 p-2 w-full rounded-lg"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Course
            </label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="border border-slate-200 p-2 w-full rounded-lg"
            >
              <option value="">Select Course</option>
              {coursesSections
                .filter(
                  (course, index, self) =>
                    index ===
                    self.findIndex((c) => c.courseId === course.courseId),
                )
                .map((course) => (
                  <option key={course.courseId} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
            </select>
          </div>

          {/* Sections */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Sections
            </label>

            <div className="flex flex-wrap gap-2">
              {filteredSections.map((sec) => (
                <label
                  key={sec.sectionId}
                  className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    value={sec.sectionNumber}
                    checked={selectedSections.includes(sec.sectionNumber)}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (e.target.checked) {
                        setSelectedSections([...selectedSections, value]);
                      } else {
                        setSelectedSections(
                          selectedSections.filter((s) => s !== value),
                        );
                      }
                    }}
                  />
                  Section {sec.sectionNumber}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {activeTab === "manual" && (
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Question
              </button>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-700">
                AI Quiz Generator
              </h2>

              <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50">
                <FileUploader
                  onGeneratedQuiz={handleGeneratedQuiz}
                  onProcessingStateChange={setIsProcessingAiFile}
                />
              </div>

              {isProcessingAiFile && (
                <p className="text-sm text-slate-500">
                  Processing uploaded file and generating quiz draft...
                </p>
              )}

              {generatedQuiz && (
                <>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    Generated {generatedQuiz.questions.length} questions from
                    the uploaded file. You can edit them below before creating
                    the quiz.
                  </div>

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
                </>
              )}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};
export default CreateQuiz;
