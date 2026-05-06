import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from '../prisma/prisma.config';
import { generateToken } from "../utils/jwt";






export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    // auth middleware attaches userId to req
    const userId= (req as any).userId;

    const Instructor = await prisma.instructor.findUnique({
        where: {userID: Number(userId)}
    })

    if (!Instructor) {
        return res.status(404).json({ error: "Instructor not found"});
    }

    console.log("Instructor record:", Instructor);


    const sections = await prisma.section.findMany({
      where: { instructorID: Number(Instructor.id) },
      include: {
        course: true,
        _count: { select: { enrollments: true}}
      },
    });

    console.log("Sections fetched:", sections)

    // Group sections by course
    const coursesMap = new Map<number, any>();

    sections.forEach((sec) => {
      if (!coursesMap.has(sec.course.id)) {
        coursesMap.set(sec.course.id, {
          courseId: sec.course.id,
          courseCode: sec.course.crs_code,
          courseName: sec.course.crs_name,
          sections: [],
        });
      }

      coursesMap.get(sec.course.id).sections.push({
        sectionId: sec.id,
        sectionNumber: sec.sectionNumber,
        totalStudents: sec._count.enrollments,
      });
    });

    const results = Array.from(coursesMap.values())
    results.sort((a, b) => a.courseId - b.courseId);
    console.log("Course response:", results)


    res.json(results);
  } catch (err) {
    console.log("Error in getInstructorCourses:", err)

    res.status(500).json({ error: "Failed to fetch instructor courses" });
  }
};








// GET /api/section/:id/details return section details
export const getSectionDetails = async (req: Request, res: Response) => {
  try {
    const sectionId = Number(req.params.id);
const section = await prisma.section.findUnique({
  where: { id: sectionId },
  include: {
    course: { select: { id: true, crs_name: true, crs_code: true } },
  },
});

if (!section) {
  return res.status(404).json({ message: "Section not found" });
}

res.json({
  sectionId: section.id,
  sectionNumber: section.sectionNumber,
  courseId: section.course.id,
  courseName: section.course.crs_name,
  courseCode: section.course.crs_code,
});

  } catch (err) {
    console.error("Error fetching section details:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};









// // this will help calculates the average scores and everything for each section and course in Instructor dashboard
// export const getInstructorAnalytics = async (req: Request, res: Response) => {
//   try {
//     const { courseId, sectionId } = req.params;
//     const userId = req.userId;

//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     // Verify instructor
//     const instructor = await prisma.instructor.findUnique({
//       where: { userID: Number(userId) },
//     });
//     if (!instructor) {
//       return res.status(403).json({ message: "Only instructors can access analytics" });
//     }

//     // Fetch quizzes + attempts for this section
//     const quizzes = await prisma.quiz.findMany({
//       where: { courseID: Number(courseId), sectionID: Number(sectionId) },
//       include: {
//         attempts: true,
//       },
//     });

//     if (!quizzes || quizzes.length === 0) {
//       return res.json({ averageScore: 0, mostStruggledQuiz: null });
//     }

//     //  Compute overall average score (average percentages directly)
//     const allScores = quizzes.flatMap(q =>
//       q.attempts.map(a => a.score ?? 0)
//     );

//     const averageScore =
//       allScores.length > 0
//         ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
//         : 0;

//     console.log("All Scores:", allScores);
//     console.log("Calculated Average Score:", averageScore);

//     //  Compute most struggled quiz (lowest average percentage)
//     let mostStruggledQuiz: any = null;
//     quizzes.forEach((quiz) => {
//       if (quiz.attempts.length > 0) {
//         const avg =
//           quiz.attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) /
//           quiz.attempts.length;

//         console.log(
//           `Quiz ${quiz.id} (${quiz.title}): avg=${avg}`
//         );

//         if (!mostStruggledQuiz || avg < mostStruggledQuiz.averageScore) {
//           mostStruggledQuiz = { id: quiz.id, title: quiz.title, averageScore: avg };
//         }
//       }
//     });

//     return res.json({
//       averageScore: Math.round(averageScore),
//       mostStruggledQuiz,
//     });
//   } catch (err) {
//     console.error("Error fetching analytics:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };




// the prev code works for row 1 only




// this will help calculates the average scores and everything for each section and course in Instructor dashboard
export const getInstructorAnalytics = async (req: Request, res: Response) => {
  try {
    const { courseId, sectionId } = req.params;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Verify instructor
    const instructor = await prisma.instructor.findUnique({
      where: { userID: Number(userId) },
    });
    if (!instructor) {
      return res.status(403).json({ message: "Only instructors can access analytics" });
    }

    // Fetch quizzes + attempts for this section
    const quizzes = await prisma.quiz.findMany({
      where: { courseID: Number(courseId), sectionID: Number(sectionId) },
      include: {
        attempts: true,
      },
    });

    if (!quizzes || quizzes.length === 0) {
      return res.json({ averageScore: 0, mostStruggledQuiz: null });
    }

    //  Compute overall average score (average percentages directly)
    const allScores = quizzes.flatMap(q =>
      q.attempts.map(a => a.score ?? 0)
    );

    const averageScore =
      allScores.length > 0
        ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length
        : 0;

    console.log("All Scores:", allScores);
    console.log("Calculated Average Score:", averageScore);

    //  Compute most struggled quiz (lowest average percentage)
    let mostStruggledQuiz: any = null;
    quizzes.forEach((quiz) => {
      if (quiz.attempts.length > 0) {
        const avg =
          quiz.attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) /
          quiz.attempts.length;

        console.log(
          `Quiz ${quiz.id} (${quiz.title}): avg=${avg}`
        );

        if (!mostStruggledQuiz || avg < mostStruggledQuiz.averageScore) {
          mostStruggledQuiz = { id: quiz.id, title: quiz.title, averageScore: avg };
        }
      }
    });

          // After computing averageScore and mostStruggledQuiz
      const quizAverages = quizzes.map((quiz) => {
        if (quiz.attempts.length > 0) {
          const avg =
            quiz.attempts.reduce((sum, a) => sum + (a.score ?? 0), 0) /
            quiz.attempts.length;
          return { id: quiz.id, title: quiz.title, averageScore: avg };
        }
        return { id: quiz.id, title: quiz.title, averageScore: 0 };
      });

      // Engagement stats: how many attempts are graded vs ungraded
let completed = 0;
let gradingPending = 0;

quizzes.forEach((quiz) => {
  // only consider submitted attempts
  const validAttempts = quiz.attempts.filter(a => a.submitted_at !== null);

  validAttempts.forEach((attempt) => {
    if (attempt.score !== null && attempt.isGraded) {
      completed++;
      console.log(`Completed → Quiz ${quiz.title}, Attempt ${attempt.id}, Student ${attempt.studentID}`);
    } else if (attempt.score !== null && !attempt.isGraded && quiz.requiresManualGrading) {
      gradingPending++;
      console.log(`Pending → Quiz ${quiz.title}, Attempt ${attempt.id}, Student ${attempt.studentID}`);
    }
  });
});

console.log("Engagement Stats →", {
  completed,
  gradingPending,

});



      const engagementStats = { completed, gradingPending };

      return res.json({
        averageScore: Math.round(averageScore),
        mostStruggledQuiz,
        quizAverages,
        engagementStats,
      });


  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// to check the pending quizzes (has written questions)
export const getUngradedAttempts = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const sectionId = Number(req.query.sectionId);

    const section = await prisma.section.findUnique({
      where: { id: Number(sectionId) },
      select: { courseID: true }
    });
    if (!section) {
  return res.status(404).json({ message: "Section not found" });
}
    const courseId = section.courseID;


    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const instructor = await prisma.instructor.findUnique({
      where: { userID: Number(userId)},
      include: { section: true },
    });

    if (!instructor) {
      return res.status(403).json({ message: "Only instructors can access this resource" });
    }

    // console.log("Filters:", { sectionId, courseId, instructorId: instructor.id });

    const quizzes = await prisma.quiz.findMany({
  where: { requiresManualGrading: true },
  select: { id: true, title: true, sectionID: true, courseID: true }
});
// console.log("Manual grading quizzes:", quizzes);

    // Fetch only attempts that match section + course + manual grading
    const ungradedAttempts = await prisma.attempt.findMany({
      where: {
        isGraded: false,
        quiz: {
          requiresManualGrading: true,   //  only written quizzes
          sectionID: sectionId,          //  filter by section
          courseID: courseId,            //  filter by course
          section: {
            instructorID: instructor.id,
          },
        },
      },
      include: {
        student: { include: { user: true } },
        quiz: {
          select: {
            id: true,
            title: true,
            requiresManualGrading: true,
            section: { select: { sectionNumber: true } },
          },
        },
      },
      orderBy: { submitted_at: "desc" }, //  newest first
    });

    // console.log("Ungraded attempts raw (no filter):", ungradedAttempts);

    //  Keep only the last attempt per student/quiz
 const latestAttempts = Object.values(
  ungradedAttempts.reduce((acc: any, attempt) => {
    const key = `${attempt.studentID}-${attempt.quizID}`;
    const currentDate = attempt.submitted_at ? new Date(attempt.submitted_at).getTime() : 0;
    const existingDate = acc[key]?.submitted_at ? new Date(acc[key].submitted_at).getTime() : 0;

    if (!acc[key] || currentDate > existingDate) {
      acc[key] = attempt;
    }
    return acc;
  }, {})
);

// console.log("Latest attempts after reduce:", latestAttempts);
const cleanedAttempts = latestAttempts.filter((a :any) => a.submitted_at !== null);

res.json(cleanedAttempts);

  } catch (err) {
    console.error("Error fetching ungraded attempts:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};







// get the pending written question attempt details so the instructor can grade it.
export const getAttemptDetails = async (req: Request, res: Response) => {
  try {
    const attemptId = Number(req.params.attemptId);

    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: { questions: {
            select: {
              id: true,
              text: true,
              type: true,
              points: true,
            }
          }}
        },
        studentAnswers: {
            include: {
              question: true,
              choice: true
            },
          },
        student: { include: { user: true } }
            }
    });

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
        console.log("Attempt details:", JSON.stringify(attempt, null, 2)); //  log full payload
    
    res.json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching attempt details" });
  }
};








export const gradeAttempt = async (req: Request, res: Response) => {
  try {
    const attemptId = Number(req.params.attemptId);
    const { grades } = req.body as { grades: { answerId: number; score: number }[] };

    // Update each StudentAnswer with the score
    for (const g of grades) {
      await prisma.studentAnswer.update({
        where: { id: g.answerId },
        data: { score: g.score },
      });
    }

    // Fetch attempt with quiz and answers
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: { include: { questions: true } },
        studentAnswers: { include: { question: true } },
      },
    });

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Sum all scores (MCQ auto + written manual)
    const totalScore = attempt.studentAnswers.reduce(
      (sum, ans) => sum + (ans.score ?? (ans.is_correct ? ans.question.points : 0)),
      0
    );

    // Total possible points = all quiz questions
    const totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);

    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,     // earned points (MCQ + written)
        points: totalPoints,   // total possible points
        totalPoints: totalPoints,
        isGraded: true,
      },
    });


// -------- xp part


console.log(">>> Starting XP calculation for student:", attempt.studentID);
const latestAttempts = await prisma.attempt.findMany({
  where: {
    studentID: attempt.studentID,
    isGraded: true,
    quiz: { sectionID: attempt.quiz.sectionID }
  },
  orderBy: { submitted_at: 'desc' }
});


console.log("Fetched attempts:", latestAttempts.map(a => ({
  attemptId: a.id,
  quizId: a.quizID,
  score: a.score,
  submitted_at: a.submitted_at
})));

// Group by quizID, always keep the newest (overwrite older ones)
const latestByQuiz: Record<number, typeof latestAttempts[0]> = {};
for (const a of latestAttempts) {
  if (!latestByQuiz[a.quizID]) {
    latestByQuiz[a.quizID] = a;
    console.log(`Keeping latest attempt for quiz ${a.quizID}:`, {
      attemptId: a.id,
      score: a.score,
      submitted_at: a.submitted_at
    });
  } else {
    console.log(`Skipping older attempt for quiz ${a.quizID}:`, {
      attemptId: a.id,
      score: a.score,
      submitted_at: a.submitted_at
    });
  }
}

const totalXp = Object.values(latestByQuiz).reduce(
  (sum, a) => sum + (a.score ?? 0) * 2,
  0
);

console.log("XP after grouping latest attempts:", totalXp);

    await prisma.enrollment.update({
      where: { studentID_sectionID: { studentID: attempt.studentID, sectionID: attempt.quiz.sectionID } },
      data: { xp: totalXp }
    });

console.log("Enrollment XP updated to:", totalXp);
    // Fetch updated enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentID_sectionID: { studentID: attempt.studentID, sectionID: attempt.quiz.sectionID } }
    });
  const unlockedPowerUps: { id: number; name: string; quantity: number }[] = [];

    if (enrollment) {
  // thresholds for each power-up
  const powerUps = [
    { id: 1, name: "Extra Time", thresholds: [20, 50, 100, 200] },
    { id: 2, name: "Time Freeze", thresholds: [50, 150, 300] },
    { id: 3, name: "50/50", thresholds: [70, 200, 400] }
  ];


  for (const p of powerUps) {
    const unlockedCount = p.thresholds.filter(t => enrollment.xp >= t).length;

    const updated = await prisma.studentPowerUp.upsert({
      where: { studentID_powerupID: { studentID: attempt.studentID, powerupID: p.id } },
      update: { quantity: unlockedCount },
      create: { studentID: attempt.studentID, powerupID: p.id, quantity: unlockedCount }
    });

    unlockedPowerUps.push({
      id: p.id,
      name: p.name,
      quantity: updated.quantity
    });
  }
    }

      // --------- Badge part

        const badgesToUnlock: { id: number; name: string }[] = [];

        // High Achiever
        const lateAttempts = await prisma.attempt.findMany({
            where: { studentID: attempt.studentID, isGraded: true },
            include: { quiz: true }
          });

          // Count quizzes with ≥80% score
          const highAchieverCount = lateAttempts.filter(a => (a.score ?? 0) / (a.points ?? 1) >= 0.8).length;

          if (highAchieverCount >= 4) {
            badgesToUnlock.push({ id: 1, name: "High Achiever" });
          }


        // Comeback Star
       
const quizzesWithComeback = await prisma.quiz.findMany({
  where: { sectionID: attempt.quiz.sectionID },
  include: {
    attempts: {
      where: { studentID: attempt.studentID, isGraded: true },
      orderBy: { submitted_at: 'desc' }
    }
  }
});

let comebackQuizzes: number[] = [];

for (const q of quizzesWithComeback) {
  if (q.attempts.length >= 2) {
    const latest = q.attempts[0]!;
    const prev = q.attempts[1]!;

    if ((latest.score ?? 0) >= 2 * (prev.score ?? 0)) {
      comebackQuizzes.push(q.id); // record quiz ID
    }
  }
}

const uniqueComebacks = new Set(comebackQuizzes);

if (uniqueComebacks.size >= 3) {
  badgesToUnlock.push({ id: 2, name: "Comeback Star" });
}


          // Quick learner badge
  
          if (attempt.start_time && attempt.end_time && attempt.quiz.duration) {
            const timeTaken = (attempt.end_time.getTime() - attempt.start_time.getTime()) / 1000; // seconds
            const allottedTime = attempt.quiz.duration * 60; // assuming duration is stored in minutes

            if (timeTaken <= allottedTime / 2) {
              badgesToUnlock.push({ id: 3, name: "Quick Learner" });
            }
          }


          // Streak master badge
          const orderedAttempts = await prisma.attempt.findMany({
              where: { studentID: attempt.studentID, isGraded: true },
              orderBy: { submitted_at: 'asc' }
            });

            let streak = 0;
            let maxStreak = 0;
            for (const a of orderedAttempts) {
              if ((a.score ?? 0) === (a.points ?? 0)) {
                streak++;
                maxStreak = Math.max(maxStreak, streak);
              } else {
                streak = 0;
              }
            }

            if (maxStreak >= 3) {
              badgesToUnlock.push({ id: 4, name: "Streak Master" });
            }

            // Leaderboard topper badge

const quizAttempts = await prisma.attempt.findMany({
  where: { quizID: attempt.quizID, isGraded: true },
  orderBy: [
    { score: 'desc' },
    { end_time: 'asc' } // tie-breaker: faster completion wins
  ],
  include: { student: true }
});

// If the current student is ranked #1 in this quiz
if (quizAttempts.length > 0 && quizAttempts[0]!.studentID === attempt.studentID) {
  badgesToUnlock.push({ id: 5, name: "Leaderboard Topper" });
}




        // Save unlocked badges
        for (const b of badgesToUnlock) {
        await prisma.studentBadge.upsert({
          where: { studentID_badgeID: { studentID: attempt.studentID, badgeID: b.id } },
          update: {},
          create: { studentID: attempt.studentID, badgeID: b.id, earned_at: new Date() }
        });
      }


  return res.json({
    message: "Grades saved",
    score: totalScore,
    points: totalPoints,
    xpEarned: totalScore * 2,
    totalXp: enrollment?.xp,
    unlockedPowerUps
  });
  } catch (err) {
console.error("Error grading attempt:", err);
    res.status(500).json({ message: "Error saving grades" });
  }
};





// -------------------------------------  view leaderboard but calculation based on every attempt of the student and not latest attempt of each quiz.


// export const viewLeaderboardInst = async (req: Request, res: Response) => {
//   try {
//     const { sectionId, courseId } = req.params;

//     const attempts = await prisma.attempt.findMany({
//       where: {
//         student: {
//           enrollments: {
//             some: { sectionID: Number(sectionId) }
//           }
//         },
//         submitted_at: { not: null },
//         isGraded: true,
//       },
//       include: {
//         quiz: { include: { questions: true } },
//         student: { include: { user: true } },
//       },
//     });

//     // console.log("Fetched attempts:", attempts.length, attempts);

//     // Group by student
//     const studentMap = new Map<number, {
//       studentName: string;
//       studentEmail: string;   
//       earned: number;
//       possible: number;
//       attempts: number;
//       avgDuration: number;
//     }>();

//     for (const a of attempts) {
//   const totalPoints = a.quiz.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
//   const rawScore = a.score ?? 0;

//   // Detect if score looks like a percentage already
//   const isPercentage = rawScore > totalPoints;

//   const percentScore = isPercentage
//     ? rawScore // already 0–100
//     : totalPoints > 0 ? (rawScore / totalPoints) * 100 : 0;

//   const durationMs = a.end_time && a.start_time
//     ? a.end_time.getTime() - a.start_time.getTime()
//     : 0;

//   if (!studentMap.has(a.student.id)) {
//     studentMap.set(a.student.id, {
//       studentName: `${a.student.user.firstName} ${a.student.user.lastName}`,
//       studentEmail: a.student.user.email,
//       earned: 0,
//       possible: 0,
//       attempts: 0,
//       avgDuration: 0,
//     });
//     console.log("Added student:", a.student.id, a.student.user.email);
//   }

//   const entry = studentMap.get(a.student.id)!;
//   entry.earned += percentScore;   //store as %
//   entry.attempts += 1;
//   entry.avgDuration += durationMs;

//   console.log("Attempt:", a.id, "raw:", rawScore, "total:", totalPoints, "percent:", percentScore);
// }


//     // Build leaderboard
//    const leaderboard = Array.from(studentMap.entries())
//   .map(([studentId, data]) => {
//     const avgScore = data.attempts > 0 ? data.earned / data.attempts : 0;
//     const avgDuration = data.attempts > 0 ? data.avgDuration / data.attempts : 0;

//     console.log("Student:", data.studentName,
//                 "earned total:", data.earned,
//                 "attempts:", data.attempts,
//                 "avgScore:", avgScore);

//     return {
//       studentId,
//       studentName: data.studentName,
//       studentEmail: data.studentEmail,
//       avgScore: Math.min(100, Math.round(avgScore)), //  clamp to 100
//       attempts: data.attempts,
//       avgDuration: `${Math.floor(avgDuration / 60000)} mins`,
//     };
//   })
//   .sort((a, b) => b.avgScore - a.avgScore)
//   .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    
//     console.log("Final leaderboard response:", leaderboard);
//     res.json({ sectionId, courseId, leaderboard });
//   } catch (err) {
//     console.error("Error building instructor leaderboard:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };









// --------------------------  view leaderboard but based on the latest attempt per student and per quiz:



export const viewLeaderboardInst = async (req: Request, res: Response) => {
  try {
    const { sectionId, courseId } = req.params;

    const attempts = await prisma.attempt.findMany({
      where: {
        student: {
          enrollments: {
            some: { sectionID: Number(sectionId) }
          }
        },
        submitted_at: { not: null },
        isGraded: true,
      },
      include: {
        quiz: { include: { questions: true } },
        student: { include: { user: true } },
      },
    });

    console.log("Fetched attempts:", attempts.length);

    // 🔹 NEW: Keep only latest attempt per student per quiz
    const latestAttemptsMap = attempts.reduce((map, a) => {
      const key = `${a.student.id}-${a.quiz.id}`;
      console.log("Key:", key, "Attempt:", a.id, "submitted_at:", a.submitted_at);
      if (!map.has(key) || a.submitted_at! > map.get(key)!.submitted_at!) {
        map.set(key, a);
      }
      return map;
    }, new Map<string, typeof attempts[0]>());

    const latestAttempts = Array.from(latestAttemptsMap.values());

    // Group by student
    const studentMap = new Map<number, {
      studentName: string;
      studentEmail: string;   
      earned: number;
      attempts: number;
      avgDuration: number;
    }>();

    for (const a of latestAttempts) {
      const totalPoints = a.quiz.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
      const rawScore = a.score ?? 0;
      const isPercentage = rawScore > totalPoints;
      const percentScore = isPercentage
        ? rawScore
        : totalPoints > 0 ? (rawScore / totalPoints) * 100 : 0;

      const durationMs = a.end_time && a.start_time
        ? a.end_time.getTime() - a.start_time.getTime()
        : 0;

      if (!studentMap.has(a.student.id)) {
        studentMap.set(a.student.id, {
          studentName: `${a.student.user.firstName} ${a.student.user.lastName}`,
          studentEmail: a.student.user.email,  
          earned: 0,
          attempts: 0,
          avgDuration: 0,
        });
        console.log("Added student:", a.student.id, a.student.user.email);
      }

      const entry = studentMap.get(a.student.id)!;
      entry.earned += percentScore;
      entry.attempts += 1;
      entry.avgDuration += durationMs;

      console.log("Latest Attempt:", a.id, "percent:", percentScore);
    }

    // Build leaderboard
    const leaderboard = Array.from(studentMap.entries())
      .map(([studentId, data]) => {
        const avgScore = data.attempts > 0 ? data.earned / data.attempts : 0;
        const avgDuration = data.attempts > 0 ? data.avgDuration / data.attempts : 0;

        return {
          studentId,
          studentName: data.studentName,
          studentEmail: data.studentEmail, 
          avgScore: Math.min(100, Math.round(avgScore)),
          attempts: data.attempts,
          avgDuration: `${Math.floor(avgDuration / 60000)} mins`,
        };
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    console.log("Final leaderboard response:", leaderboard);
    res.json({ sectionId, courseId, leaderboard });
  } catch (err) {
    console.error("Error building instructor leaderboard:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
