import express, { Router } from 'express'
import { uploadFile, handleAIQuery} from './Controller.js';
import multer from "multer";


const router=express.Router()
const upload = multer({ dest: "uploads/" });


router.post("/upload", upload.single("file"), uploadFile);
router.post('/ask',handleAIQuery)









export default router;