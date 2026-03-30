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
    const { title, duration, deadline, courseID, sectionID, questions } =
      req.body;

    if (!title || !duration || !deadline || !courseID || !sectionID) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: title, duration, deadline, courseID, sectionID",
        });
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

    const section = await prisma.section.findUnique({
      where: { id: Number(sectionID) },
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    if (section.instructorID !== creator.instructor.id) {
      return res
        .status(403)
        .json({ message: "You can only create quizzes for your own sections" });
    }

    if (section.courseID !== Number(courseID)) {
      return res
        .status(400)
        .json({
          message: "sectionid does not belong to the provided courseID",
        });
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
    const quiz = await prisma.quiz.create({
      data: {
        title,
        duration: Number(duration),
        deadline: parsedDeadline,
        created_at: new Date(),
        source_type: "manual",
        courseID: Number(courseID),
        sectionID: Number(sectionID),
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

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (err: any) {
    if (err.message?.includes("Question")) {
      return res.status(400).json({ message: err.message });
    }

    console.error("Error creating quiz: ", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// handler to retrieve quiz details for students
export const getQuiz = async (req: Request, res: Response) => {
  try {

    const userId = req.userId;

    if(!userId) {
      return res.status(401).json({message: "Unauthorized"});
    }

    const quizIdRaw = req.params.quizId;
    const quizId = Number(quizIdRaw);

    if(!quizId || Number.isNaN(quizId) || quizId <= 0) {
      return res.status(400).json({message: "Valid quizID is required"});
    }

    const studentUser = await prisma.user.findUnique({
      where: {userId: parseInt(userId)},
      include: {student: true}, // include nested Student record
    })

    if(!studentUser || studentUser.role !== "student" || !studentUser.student) {
      return res.status(403).json({message: "Only students can retireve quiz details"});
    }

    const quiz = await prisma.quiz.findUnique({
      where: {id: quizId},
      include: {
        questions: {
          include: {
            choices: {
              select: {
                id: true,
                text: true,
              }
            }
          }
        }
      }
    });

    if(!quiz) {
      return res.status(404).json({message: "Quiz not found"});
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentID_sectionID: {
          studentID: studentUser.student.id,
          sectionID: quiz.sectionID,
        }
      }
    });

    if(!enrollment) {
      return res.status(403).json({message: "You are not enrolled in this quiz section"});
    }

    return res.status(200).json({message: "Quiz retrieved successfully", quiz});
    
  } catch (err: any) {
    console.error("Error retrieving quiz: ", err);
    return res.status(500).json({message: "Internal Server Error"})
  }
};