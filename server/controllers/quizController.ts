import { Request, Response } from "express";
import { prisma } from "../prisma/prisma.config";

// handler to manual quiz creation
export const createQuiz = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // get quiz info from request's body sent from frontend
    const { title, duration, maxAttempts,deadline, courseCode, sectionNumbers, questions } =
      req.body;

    if (!title || !duration || !deadline || !courseCode || !sectionNumbers) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: title, duration, maxAttempts, deadline, courseID, sectionID",
        });
    }
    if (!Array.isArray(sectionNumbers) || sectionNumbers.length === 0) {
  return res.status(400).json({ message: "At least one section must be selected" });
} 
    const sectionNumbersInt = sectionNumbers.map((num: string | number) => parseInt(num as string, 10));

    const course = await prisma.course.findUnique({
      where: { crs_code: courseCode }
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const sections = await prisma.section.findMany({
    where: {
      courseID: course.id,
      sectionNumber: {in: sectionNumbersInt},
      }
    });
    if (sections.length !== sectionNumbersInt.length) {
      return res.status(404).json({ message: "One or more sections are not found" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Quiz must contain at least one question" });
    }

    const parsedDeadline = new Date(deadline);
    if (Number.isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({ message: "Invalid deadline format" });
    }

    const creator = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      include: { instructor: true },
    });

    // check creator is "instructor"
    if (!creator || creator.role !== "instructor" || !creator.instructor) {
      return res
        .status(403)
        .json({ message: "Only instructors can create quizzes" });
    }

    if (sections.length === 0) {
      return res.status(404).json({ message: "Sections not found" });
    }

    for(const section of sections) {
      if (section.instructorID !== creator.instructor.id) {
      return res
        .status(403)
        .json({ message:  `You can only create quizzes for your own sections (failed at section ${section.sectionNumber} ` });
    }

    if (section.courseID !== course.id) {
      return res
        .status(400)
        .json({
          message:  `section ${section.sectionNumber} does not belong to the provided courseID `,
        });
    }
    }
   


    // validate questions before saving them to the database
    const validatedQuestions = questions.map((q: any, index: number) => {
      if (!q.text || !q.type || !q.points || !q.difficulty) {
        throw new Error(`Questions ${index + 1} is missing required fields`);
      }

      const type = String(q.type).toLowerCase();
      if (type !== "mcq" && type !== "written") {
        throw new Error(
          `Question ${index + 1} has unsupported type. Use 'mcq' or 'written'`,
        );
      }

      if (type === "mcq") {
        if (!Array.isArray(q.choices) || q.choices.length < 2) {
          throw new Error(
            `MCQ Question ${index + 1} must have at least 2 choices`,
          );
        }

        const allChoicesHaveText = q.choices.every(
          (c: any) => c.text && c.text.trim() !== ""
        );
        if (!allChoicesHaveText){
          throw new Error(
            `MCQ Question ${index +1} has empty choice input. All choices must be filled in.`
          );
        }

        const correctChoices = q.choices.filter(
          (c: any) => c.is_correct === true,
        );
        if (correctChoices.length !== 1) {
          throw new Error(
            `Question ${index + 1} must have exactly one correct choice`,
          );
        }
      }

      if (
        type === "written" &&
        Array.isArray(q.choices) &&
        q.choices.length > 0
      ) {
        throw new Error(
          `Written Question ${index + 1} should not include choices`,
        );
      }

      // shared question fields for both q types
      const baseQuestion = {
        text: q.text,
        type,
        points: Number(q.points),
        difficulty: q.difficulty,
      };

      // add choices for mcq questions
      if (type === "mcq") {
        return {
          ...baseQuestion,
          choices: {
            create: q.choices.map((choice: any) => ({
              text: choice.text,
              is_correct: Boolean(choice.is_correct),
            })),
          },
        };
      }

      return baseQuestion;
    });

    // create quiz database record 
    const createdQuizzes = [];
    for (const section of sections) {
         const quiz = await prisma.quiz.create({
      data: {
        title,
        duration: Number(duration),
        maxAttempts: maxAttempts ?? 1,
        deadline: parsedDeadline,
        created_at: new Date(),
        source_type: "manual",
        courseID: course.id,
        sectionID: section.id,
        userID: creator.userId,
        questions: {
          create: validatedQuestions,
        },
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });

   createdQuizzes.push(quiz);
    }
   return res.status(201).json({
          message: "Quiz created successfully",
          quizzes: createdQuizzes,
        });
  } catch (err: any) {
    if (err.message?.includes("Question")) {
      return res.status(400).json({ message: err.message });
    }

    console.error("Error creating quiz: ", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};










export const getInstructorSections = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const instructor = await prisma.instructor.findUnique({
      where: { userID: Number(userId) },
      include: { section: { include: { course: true } } }, // matches schema
    });

    if (!instructor) return res.status(404).json({ message: "Instructor not found" });

    const data = (instructor.section || []).map(section => ({
      sectionId: section.id,
      sectionNumber: section.sectionNumber,
      courseId: section.course.id,
      courseCode: section.course.crs_code,
      courseName: section.course.crs_name,
    }));

    return res.json(data);
  } catch (err) {
    console.error("Error in getInstructorSections:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







export const getQuiz = async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);

    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });


    const quizId = Number(req.params.quizId);
    if (!quizId || Number.isNaN(quizId)) {
      return res.status(400).json({ message: "Valid quizID is required" });
    }

    const studentUser = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      include: { student: true },
    });
    if (!studentUser || studentUser.role !== "student" || !studentUser.student) {
      return res.status(403).json({ message: "Only students can retrieve quiz details" });
    }

    const studentID = studentUser.student.id;

    console.log("quizId:", quizId, "courseId:", courseId);

// const enrollments = await prisma.enrollment.findMany({
//   where: { studentID: studentUser.student.id },
// });

// Collect section IDs the student belongs to
// const sectionIDs = enrollments.map(e => e.sectionID);


const sectionId = Number(req.params.sectionId);


    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, courseID : courseId},
      include: {
        questions: {
          include: { 
            choices: { select: { id: true, text: true } } },
        },
        attempts:true,
      },
    });
    console.log("req.params:", req.params);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.courseID !== courseId) {
  return res.status(404).json({ message: "Quiz not found in this course" });
}
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentID_sectionID: {
          studentID: studentUser.student.id,
          sectionID: quiz.sectionID,
        },
      },
    });
    if (!enrollment) {
      return res.status(403).json({ message: "You are not enrolled in this quiz section" });
    }

    const attempt = await prisma.attempt.findFirst({
      where: {
        quizID: quizId,
        studentID: Number(studentID),
      },
      include: { studentAnswers: true },
    });

    return res.status(200).json({
      message: "Quiz retrieved successfully",
      quiz,
      attempt: attempt || null, 
    });
 
  } catch (err) {
    console.error("Error retrieving quiz: ", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};









// export const submitQuizAttempt = async (req: Request, res: Response) => {
//   try {
//     console.log("Incoming request:", {
//   userId: req.userId,
//   quizId: req.params.quizId,
//   answers: req.body.answers,
//     });

//       const userId = req.userId;
//       const quizId = Number(req.params.quizId);
//       const { answers } = req.body;
    

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Verify student
//     const studentUser = await prisma.user.findUnique({
//       where: { userId: parseInt(userId) },
//       include: { student: true },
//     });
//     if (!studentUser || studentUser.role !== "student" || !studentUser.student) {
//       return res.status(403).json({ message: "Only students can submit attempts" });
//     }

//     console.log("Fetched studentUser:", studentUser);

//     // Fetch quiz with correct answers
//     const quiz = await prisma.quiz.findUnique({
//       where: { id: quizId },
//       include: { questions: { include: { choices: true } } },
//     });
//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//     // Calculate score
//     let correctCount = 0;
//     quiz.questions.forEach((q) => {
//       const studentAnswer = answers[q.id];
//       const correctChoice = q.choices.find((c) => c.is_correct);
//       if (studentAnswer === correctChoice?.id) correctCount++;
//     });
//   const score = quiz.questions.length > 0
//   ? Math.round((correctCount / quiz.questions.length) * 100)
//   : 0;
//   console.log("Final score:", score, "CorrectCount:", correctCount, "Total questions:", quiz.questions.length);

//     // Save attempt + answers
//     console.log("Answers payload:", answers);
//     console.log("Quiz questions:", quiz.questions.map(q => q.id));
    
//     const attempt = await prisma.attempt.create({
//       data: {
//         studentID: studentUser.student.id,
//         quizID: quizId,
//         score,
//         start_time: new Date().getTime(),
//         end_time: new Date().getTime(),
//         submitted_at: new Date(),
//         studentAnswers: {
//           create: Object.entries(answers).map(([questionId, choiceOrText]) => {
//             const question = quiz.questions.find((p) => p.id === Number(questionId));
//             const correctChoice = question?.choices.find((c) => c.is_correct);
//             const answerData: any = {
//               question: {
//                 connect: { id: Number(questionId) },
//               },
//               short_text_ans: typeof choiceOrText === "string" ? choiceOrText : null,
//               is_correct: typeof choiceOrText === "number" && choiceOrText === correctChoice?.id,
//               time_taken: 0,
//               feedback: "",
//             };
//             if (typeof choiceOrText === "number") {
//               answerData.selected_ans_id = choiceOrText;
//               // answerData.selected_choiceID = choiceOrText;
//             }
//             return answerData;
//           }),
//         },
//       },
//     });

//     return res.json({ score, attemptId: attempt.id });
//   } catch (err) {
//     console.error("Error submitting attempt:", err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };






// export const submitQuizAttempt = async (req: Request, res: Response) => {
//   try {
//     console.log("Incoming request:", {
//       userId: req.userId,
//       quizId: req.params.quizId,
//       answers: req.body.answers,
//     });

//     const userId = req.userId;
//     const quizId = Number(req.params.quizId);
//     const { answers } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Verify student
//     const studentUser = await prisma.user.findUnique({
//       where: { userId: parseInt(userId) },   
//     });
//     if (!studentUser || studentUser.role !== "student" || !studentUser.student) {
//       return res.status(403).json({ message: "Only students can submit attempts" });
//     }

//     console.log("Fetched studentUser:", studentUser);

//     // Fetch quiz with correct answers
//     const quiz = await prisma.quiz.findUnique({
//       where: { id: quizId },
//       include: { questions: { include: { choices: true } } },
//     });
//     if (!quiz) return res.status(404).json({ message: "Quiz not found" });

//     // Calculate score
//     let correctCount = 0;
//     let earnedPoints = 0;
//     let totalPoints = 0;
//     quiz.questions.forEach((q) => {
//       const studentAnswer = answers[q.id];
//       const correctChoice = q.choices.find((c) => c.is_correct);
    
//       totalPoints += q.points;
//       if (studentAnswer === correctChoice?.id) correctCount++;
//       if (typeof studentAnswer === "number" && studentAnswer === correctChoice?.id){
//         earnedPoints += q.points;
//       }

//     });

//     const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

//     console.log("Final score:", score, "CorrectCount:", correctCount, "Total questions:", quiz.questions.length);

//     // Save attempt + answers
//     console.log("Answers payload:", answers);
//     console.log("Quiz questions:", quiz.questions.map(q => q.id));

//     const attempt = await prisma.attempt.create({
//       data: {
//         studentID: studentUser.student.id,
//         quizID: quizId,
//         score,
//         points: earnedPoints,
//         totalPoints: totalPoints,
//         start_time: new Date(),
//         end_time: new Date(),

//         submitted_at: new Date(),
//         studentAnswers: {
//           create: Object.entries(answers).map(([questionId, choiceOrText]) => {
//             const question = quiz.questions.find((p) => p.id === Number(questionId));
//             const correctChoice = question?.choices.find((c) => c.is_correct);

//             return {
//               question: { connect: { id: Number(questionId) } },
//               short_text_ans: typeof choiceOrText === "string" ? choiceOrText : null,
//               is_correct: typeof choiceOrText === "number" && choiceOrText === correctChoice?.id,
//               time_taken: 0,
//               feedback: "",
//               selected_ans_id: typeof choiceOrText === "number" ? choiceOrText : 0, 
//             };
//           }),
//         },
//       },
//     });

//     return res.json({ 
//       score, 
//       points: earnedPoints,
//       totalPoints: totalPoints,
//       attemptId: attempt.id 
//     });
//   } catch (err) {
//     console.error("Error submitting attempt:", err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };





export const startAttempt = async (req: Request, res: Response) => {
  try {
    console.log("Incoming startAttempt request body:", req.body);  
    console.log("req.userId:", req.userId); 
    const userId = req.userId;
    const { quizID, } = req.body;

        const studentUser = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      include: {student: true}
    }
  );
    if (!studentUser || !studentUser.student) {
      return res.status(404).json({ message: "Only students can access this resource" });
    }

    const studentId = studentUser.student.id;
      console.log("Resolved studentId:", studentId);

      const quiz = await prisma.quiz.findUnique({
        where: { id: quizID},
      });
      if (!quiz) return res.status(404).json({ message: "Quiz not found"});

        if (quiz.maxAttempts !== null){
          const existingAttempts = await prisma.attempt.count({
            where: {quizID: Number(quizID), studentID: studentId},
        });
      

          if (existingAttempts >= quiz.maxAttempts){
            return res.status(403).json({ message: "Maximum attempts reached"});
          }

        }
    const attempt = await prisma.attempt.create({
      data: {
        studentID: studentId,
        quizID,
        start_time: new Date(),
      },
    });

    res.json({ attemptId: attempt.id,
              quizId: quiz.id,
              duration: quiz.duration,
              deadline: quiz.deadline,
    });
    console.log("Created attempt:", attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







export const submitAttempt = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { attemptId, quizId, answers } = req.body;

    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: { questions: { include: { choices: true } } },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let points = 0;
    let totalPoints = 0;

    const studentAnswersData = Object.entries(answers).map(([questionId, choiceOrText]) => {
      const question = quiz.questions.find(q => q.id === Number(questionId));
      if (!question) return null;

      totalPoints += question.points;
      const correctChoice = question.choices.find(c => c.is_correct);
      let isCorrect = false;

      if (question.type === "mcq" && typeof choiceOrText === "number") {
        isCorrect = choiceOrText === correctChoice?.id;
        if (isCorrect) points += question.points;
      } else if (question.type === "written" && typeof choiceOrText === "string") {
        if (choiceOrText.trim() !== "") {
          // points += question.points;
          isCorrect = false;
        }
      }

      return {
        question: { connect: { id: Number(questionId) } },
        short_text_ans: typeof choiceOrText === "string" ? choiceOrText : null,
        is_correct: isCorrect,
        time_taken: 0,
        feedback: "",
        selected_ans_id: typeof choiceOrText === "number" ? choiceOrText : 0,
      };
    }).filter((ans): ans is NonNullable<typeof ans> => ans !== null);

    const score = totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0;

    console.log("Submit payload:", {
  attemptId,
  quizId,
  answers,
  score,
  points,
  totalPoints,
  studentAnswersData,
});

    const updatedAttempt = await prisma.attempt.update({
      where: { id: Number(attemptId) },
      data: {
        score,
        points,
        totalPoints,
        end_time: new Date(),
        submitted_at: new Date(),
        studentAnswers: { create: studentAnswersData },
      },
    });

    console.log("Updated attempt:", updatedAttempt);

    const durationSeconds =
      (updatedAttempt.end_time!.getTime() - updatedAttempt.start_time.getTime()) / 1000;

    res.json({ ...updatedAttempt, duration: durationSeconds });
  } catch (err) {
    console.error("Error submitting attempt:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
