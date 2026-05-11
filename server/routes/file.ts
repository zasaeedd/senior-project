import express from "express";
import { supabaseAuthenticate } from "../middleware/authMiddleware";
import {  saveFMD,
     listFilesInstructor,
     processFile,
 } from "../controllers/fileController";


const router = express.Router();

// save metadata of the file in the database
router.post("/saveFileMetadata", supabaseAuthenticate, saveFMD);
// router.get("/downloadFile/:filename", supabaseAuthenticate, downloadFile);

// get the list of files uploaded by the instructor
router.get("/myFiles", supabaseAuthenticate, listFilesInstructor);

router.post("/:id/process", supabaseAuthenticate, processFile);

export default router;