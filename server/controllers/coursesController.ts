import { Request, Response } from "express";
import { prisma } from "../prisma/prisma.config";

export const getStudentCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; 
    console.log("Decoded userId:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const student = await prisma.student.findUnique({
      where: { userID: Number(userId) },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Resolved studentId:", student.id);

    const enrollments = await prisma.enrollment.findMany({
      where: { studentID: student.id },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    console.log("Raw enrollments from DB:", JSON.stringify(enrollments, null, 2));
    
    const formatted = enrollments.map((enroll) => ({
      courseId: enroll.section.course.id,
      courseCode: enroll.section.course.crs_code,
      courseName: enroll.section.course.crs_name,
      sectionNumber: enroll.section.sectionNumber,
      status: enroll.status,
      xp: enroll.xp,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// this helps with filtering the pie chart
// export const getStudentCoursesWithQuizzes = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId; 
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const student = await prisma.student.findUnique({
//       where: { userID: Number(userId) },
//     });

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     // Fetch enrollments and include quizzes directly from the enrolled sections
//     const enrollments = await prisma.enrollment.findMany({
//       where: { studentID: student.id },
//       include: {
//         section: {
//           include: {
//             course: {
//               include: {
//                 quizzes: {
//                   where: { deadline: { gte: new Date() } }, // only active quizzes
//                   include: {
//                     attempts: {
//                       where: { studentID: student.id }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     // Format response
//     const formatted = enrollments.map((enroll) => ({
//       courseId: enroll.section.course.id,
//       courseCode: enroll.section.course.crs_code,
//       courseName: enroll.section.course.crs_name,
//       sectionNumber: enroll.section.sectionNumber,
//       status: enroll.status,
//       xp: enroll.xp,
//       quizzes: enroll.section.course.quizzes || []
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("Error fetching student courses with quizzes:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// mini update 8:15 pm 21/4
export const getStudentCoursesWithQuizzes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; 
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const student = await prisma.student.findUnique({
      where: { userID: Number(userId) },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch enrollments and include quizzes directly from the enrolled sections
    const enrollments = await prisma.enrollment.findMany({
      where: { studentID: student.id },
      include: {
        section: {
          include: {
            course: {
              include: {
                quizzes: {
                  include: {
                    attempts: {
                      where: { studentID: student.id }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Format response
    const formatted = enrollments.map((enroll) => ({
      courseId: enroll.section.course.id,
      courseCode: enroll.section.course.crs_code,
      courseName: enroll.section.course.crs_name,
      sectionNumber: enroll.section.sectionNumber,
      status: enroll.status,
      xp: enroll.xp,
      //  filter quizzes here by sectionID if needed
      quizzes: (enroll.section.course.quizzes || []).filter(
        q => q.sectionID === enroll.section.id
      )
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching student courses with quizzes:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};












// before update 7:19pm 21/4

// GET quizzes for a course (with student attempts)
// export const getCourseQuizzes = async (req: Request, res: Response) => {
//   console.log("Route hit with courseId:", req.params.courseId);

//   const { courseId } = req.params;
//   const userId = req.userId;

//   console.log("Authenticated userId:", userId);

//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const studentUser = await prisma.user.findUnique({
//       where: { userId: Number(userId)},
//       include: {student: true}
//     })

//     if (!studentUser || !studentUser.student){
//       return res.status(403).json({message: "Only students can view quizzes"});
//     }
//     const enrollments = await prisma.enrollment.findMany({
//   where: { studentID: studentUser.student.id },
// });
//     const sectionIDs = enrollments.map(e => e.sectionID);

//     console.log("Student sectionIDs:", sectionIDs);
// console.log("Enrollments:", enrollments);

//     const quizzes = await prisma.quiz.findMany({
//   where: {
//     courseID: Number(courseId),
//     sectionID: { in: sectionIDs },
//     deadline: { gte: new Date() }
//   }
// });
// console.log("Quiz deadlines:", quizzes.map(q => q.deadline));
// console.log("Direct quiz query:", quizzes);
// const quizzess = await prisma.quiz.findMany({
//   where: {
//     courseID: 1,
//     sectionID: 1
//   }
// });
// console.log("Direct quiz query (no deadline):", quizzess);
// console.log("Now (UTC):", new Date().toISOString());

//     const course = await prisma.course.findUnique({
//       where: { id: Number(courseId) }, 
//       include: {
//         quizzes: {
//           where: {
//               sectionID: { in: sectionIDs},
//               deadline: { gte: new Date()}
//           },
//           include: { 
//             attempts: {
//               where: { studentID: studentUser.student.id}
//             } },
//         },
//       },
//     });

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     if (!course.quizzes || course.quizzes.length === 0) {
//     return res.json({ message: "No quizzes posted yet" });
//     }

//     res.json(course);


//     console.log("Course with quizzes:", course);
//     res.json(course);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch quizzes" });
//   }
// };



export const getCourseQuizzes = async (req: Request, res: Response) => {
  console.log("Route hit with courseId:", req.params.courseId);

  const { courseId } = req.params;
  const userId = req.userId;

  console.log("Authenticated userId:", userId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const studentUser = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      include: { student: true },
    });

    if (!studentUser || !studentUser.student) {
      return res.status(403).json({ message: "Only students can view quizzes" });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentID: studentUser.student.id },
    });
    const sectionIDs = enrollments.map((e) => e.sectionID);

    console.log("Student sectionIDs:", sectionIDs);

    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        quizzes: {
          where: {
            sectionID: { in: sectionIDs },
            // include expired quizzes too, so frontend can grey them out
          },
          include: {
            attempts: {
              where: { studentID: studentUser.student.id },
            },
            questions: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    //  Always return the course object, even if quizzes is empty


    // console.log("Course with quizzes:", course);
    return res.json(course);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};








export const getCourseProgress = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.userId;

  const studentUser = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: { student: true }
  });

  if (!studentUser?.student) {
    return res.status(403).json({ message: "Only students can view progress" });
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { studentID: studentUser.student.id},
  });
  const sectionIDs = enrollments.map(e => e.sectionID);

  const course = await prisma.course.findUnique({
    where: { id: Number(courseId) },
    include: {
      quizzes: {
        where:{
          sectionID: {in: sectionIDs},
          deadline: { gte: new Date()}
        },
        include: {
          attempts: {
            where: { studentID: studentUser.student.id }
          }
        }
      }
    }
  });

  if (!course) return res.status(404).json({ message: "Course not found" });

  const progress = course.quizzes.map(q => {
  let status: "not-started" | "in-progress" | "completed" = "not-started";

  if (q.attempts.length > 0) {
    status = q.attempts.some(a => a.submitted_at) ? "completed" : "in-progress";
  }

  return { id: q.id, title: q.title, status };
});

res.json({
  courseId: course.id,
  totalQuizzes: course.quizzes.length,
  completedQuizzes: progress.filter(p => p.status === "completed").length,
  quizzes: progress
});

};





export const getStudentPerformance = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { courseId, from, to } = req.query;

  const studentUser = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: { student: true },
  });

  if (!studentUser?.student) {
    return res.status(403).json({ message: "Only students can view performance history" });
  }

  const filters: any = { studentID: studentUser.student.id };

  // Optional course filter
  if (courseId) {
    filters.quiz = { courseID: Number(courseId) };
  }

  // Optional date range filter
  if (from || to) {
    filters.submitted_at = {};
    if (from) filters.submitted_at.gte = new Date(from as string);
    if (to) filters.submitted_at.lte = new Date(to as string);
  }

  const attempts = await prisma.attempt.findMany({
    where: filters,
    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          courseID: true,
          course: { select: { crs_name: true } },
        },
      },
    },
    orderBy: { submitted_at: "asc" },
  });

  const performance = attempts.map(a => ({
    quizId: a.quiz.id,
    quizTitle: a.quiz.title,
    courseId: a.quiz.courseID,
    courseName: a.quiz.course.crs_name,
    score: a.score,
    submitted_at: a.submitted_at,
  }));

  res.json(performance);
};


export const getStudentBadges = async (req: Request, res: Response) => {
    const userId = req.userId;

  const studentUser = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    include: { student: true },
  });

  if (!studentUser?.student) {
    return res.status(403).json({ message: "Only students can view performance history" });
  }
  const studId = studentUser.student.id;

  console.log("Student Id for badge:", studId)

  const badges = await prisma.studentBadge.findMany({
    where: { studentID : studId },
    include: { badge: true }
  });

  res.json(
    badges.map(sb => ({
      id: sb.badge.id,
      name: sb.badge.name,
      description: sb.badge.description,
      imageUrl: sb.badge.imageUrl 
    }))
  );
}


