
import express from "express";
import  {downloadVideo}  from "../controllers/video.controller";

const router = express.Router();

router.get("/download", downloadVideo);

export default router;