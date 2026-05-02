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

    const hasWrittenQuestions = validatedQuestions.some(
    (q: any) => q.type === "written"
    );

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
        requiresManualGrading: hasWrittenQuestions,
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

//         const existingAttempt = await prisma.attempt.findFirst({
//   where: {
//     quizID: Number(quizID),
//     studentID: studentId,
//     submitted_at: null, // not submitted yet
//   },
// });

// if (existingAttempt) {
//   // count how many submitted attempts this student already has
//   const submittedAttemptsCount = await prisma.attempt.count({
//     where: {
//       quizID: Number(quizID),
//       studentID: studentId,
//       submitted_at: { not: null },
//     },
//   });

//   return res.json({
//     attemptId: existingAttempt.id,
//     quizId: quiz.id,
//     duration: quiz.duration,
//     deadline: quiz.deadline,
//     attemptNumber: submittedAttemptsCount + 1,
//   });

// }
    const attempt = await prisma.attempt.create({
      data: {
        studentID: studentId,
        quizID,
        start_time: new Date(),
        // isActive:true,
      },
    });

//     const submittedAttemptsCount = await prisma.attempt.count({
//   where: {
//     quizID: Number(quizID),
//     studentID: studentId,
//     submitted_at: { not: null },
//   },
// });

    res.json({ attemptId: attempt.id,
              quizId: quiz.id,
              duration: quiz.duration,
              deadline: quiz.deadline,
              // attemptNumber: submittedAttemptsCount+1,
    });
    console.log("Created attempt:", attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// export const submitAttempt = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });
//     const { attemptId, quizId, answers } = req.body;

//     const quiz = await prisma.quiz.findUnique({
//       where: { id: Number(quizId) },
//       include: { questions: { include: { choices: true } } },
//     });
    
//     const requiresManualGrading = quiz?.requiresManualGrading ?? false;

//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     let points = 0;
//     let totalPoints = 0;

//     const studentAnswersData = Object.entries(answers).map(([questionId, choiceOrText]) => {
//       const question = quiz.questions.find(q => q.id === Number(questionId));
//       if (!question) return null;

//       totalPoints += question.points;
//       const correctChoice = question.choices.find(c => c.is_correct);
//       let isCorrect = false;

//       if (question.type === "mcq" && typeof choiceOrText === "number") {
//         isCorrect = choiceOrText === correctChoice?.id;
//         if (isCorrect) points += question.points;
//       } else if (question.type === "written" && typeof choiceOrText === "string") {
//         if (choiceOrText.trim() !== "") {
//           // points += question.points;
//           isCorrect = false;
//         }
//       }

//       return {
//         question: { connect: { id: Number(questionId) } },
//         short_text_ans: typeof choiceOrText === "string" ? choiceOrText : null,
//         is_correct: isCorrect,
//         time_taken: 0,
//         feedback: "",
//         selected_ans_id: typeof choiceOrText === "number" ? choiceOrText : 0,
//       };
//     }).filter((ans): ans is NonNullable<typeof ans> => ans !== null);

//     const score = totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0;

//     console.log("Submit payload:", {
//   attemptId,
//   quizId,
//   answers,
//   score,
//   points,
//   totalPoints,
//   studentAnswersData,
// });

//     const updatedAttempt = await prisma.attempt.update({
//       where: { id: Number(attemptId) },
//       data: {
//         score,
//         points,
//         totalPoints,
//         end_time: new Date(),
//         submitted_at: new Date(),
//         isGraded: quiz.requiresManualGrading ? false : true,
//         studentAnswers: { create: studentAnswersData },
//       },
//     });

//     console.log("Updated attempt:", updatedAttempt);

//     const durationSeconds =
//       (updatedAttempt.end_time!.getTime() - updatedAttempt.start_time.getTime()) / 1000;

//     res.json({ ...updatedAttempt, duration: durationSeconds });
//   } catch (err) {
//     console.error("Error submitting attempt:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };








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

    const requiresManualGrading = quiz.requiresManualGrading ?? false;

    let earnedPoints = 0;   // points earned from auto‑graded MCQs
    let possiblePoints = 0; // total possible points (MCQ + written)

    const studentAnswersData = Object.entries(answers)
      .map(([questionId, choiceOrText]) => {
        const question = quiz.questions.find(q => q.id === Number(questionId));
        if (!question) return null;

        // always add question points to possible total
        possiblePoints += question.points;

        const correctChoice = question.choices.find(c => c.is_correct);
        let isCorrect = false;

        if (question.type.toLowerCase() === "mcq" && typeof choiceOrText === "number") {
          isCorrect = choiceOrText === correctChoice?.id;
          if (isCorrect) earnedPoints += question.points;
        } else if (question.type.toLowerCase() === "written" && typeof choiceOrText === "string") {
          // written answers are stored but not graded yet
          if (choiceOrText.trim() !== "") {
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
      })
      .filter((ans): ans is NonNullable<typeof ans> => ans !== null);

    //  store raw earned points, not percentage
    const score = earnedPoints;

    console.log("Submit payload:", {
      attemptId,
      quizId,
      answers,
      score,
      earnedPoints,
      possiblePoints,
      studentAnswersData,
    });

    const updatedAttempt = await prisma.attempt.update({
      where: { id: Number(attemptId) },
      data: {
        score,                  // earned MCQ points only
        points: possiblePoints, // total possible points (MCQ + written)
        totalPoints: possiblePoints,
        end_time: new Date(),
        submitted_at: new Date(),
        // isActive: false,
        isGraded: requiresManualGrading ? false : true,
        studentAnswers: { create: studentAnswersData },
      },
    });

    console.log("Updated attempt:", updatedAttempt);

    const durationSeconds =
      (updatedAttempt.end_time!.getTime() - updatedAttempt.start_time.getTime()) / 1000;

      // get the studentID
      const studentUser = await prisma.user.findUnique({
          where: { userId: Number(userId) },
          include: { student: true },
        });

        if (!studentUser || !studentUser.student) {
          return res.status(404).json({ message: "Only students can submit attempts" });
        }

        const studentId = studentUser.student.id;




      const submittedAttemptsCount = await prisma.attempt.count({
        where: {
          quizID: Number(quizId),
          studentID: studentId,
          submitted_at: { not: null }, // only submitted ones
        },
      });

// Next attempt number = submitted attempts + 1
// const nextAttemptNumber = submittedAttemptsCount + 1;

    res.json({ ...updatedAttempt, duration: durationSeconds });
  } catch (err) {
    console.error("Error submitting attempt:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







export const viewLeaderboard = async (req: Request, res: Response) => {
  try {
    const { quizId, courseId } = req.params;
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Resolve student record for this user
    const student = await prisma.student.findUnique({
      where: { userID: Number(userId) },
    });

    // If not a student, block
    if (!student) {
      return res.status(403).json({ message: "Only students can view leaderboard" });
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        quizID: Number(quizId),
        submitted_at: { not: null },
        isGraded: true,
      },
      include: {
        quiz: {
          include: { questions: true }, 
        },
        student: {
          include: {
            user: true,
            enrollments: {
              include: {
                section: {
                  include: { course: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        submitted_at: "desc",
      },
    });

    // Filter by course
    const filteredAttempts = attempts.filter((a) =>
      a.student.enrollments.some(
        (enrollment) => enrollment.section.course.id === Number(courseId)
      )
    );

    // Deduplicate: keep only latest attempt per student
    const latestAttemptsMap = new Map<number, typeof filteredAttempts[0]>();
    for (const attempt of filteredAttempts) {
      if (!latestAttemptsMap.has(attempt.student.id)) {
        latestAttemptsMap.set(attempt.student.id, attempt);
      }
    }
    const latestAttempts = Array.from(latestAttemptsMap.values());

    const formatDuration = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

  const leaderboard = latestAttempts
  .map((a) => {
    const durationMs =
      a.end_time && a.start_time
        ? a.end_time.getTime() - a.start_time.getTime()
        : 0;

    const earnedPoints = a.score ?? 0; // safe against null
    const totalPoints = a.quiz.questions.reduce(
      (sum, q) => sum + (q.points ?? 0),
      0
    );

    const percentage =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return {
      studentId: a.student.id,
      studentName: `${a.student.user.firstName} ${a.student.user.lastName}`,
      score: earnedPoints,
      totalPoints,
      percentage,
      duration: formatDuration(durationMs),
    };
  })
  .sort((a, b) => b.percentage - a.percentage)
  .map((entry, idx) => ({ rank: idx + 1, ...entry }));


      console.log("Resolved student:", student?.id, student?.userID);
      console.log("Leaderboard entries:", leaderboard.map(l => ({
        studentId: l.studentId,
        studentName: l.studentName,
        score: l.score,
        duration: l.duration
      })));

    res.json({ quizId, leaderboard, currentStudentId: student.id });
  } catch (err) {
    console.error("Error building leaderboard:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
