// import { downloadVideo } from './../controllers/video.controller';
// import express from "express";
// import  {downloadVideo}  from "../controllers/video.controller";

// const router = express.Router();

// router.get("/download", downloadVideo);

// export default router;

// import express from "express";
// import { downloadVideo } from "../controllers/video.controller";

// const router = express.Router();

// router.get("/download", async (req, res) => {
//   await downloadVideo(req, res);
// });

// export default router;


//deepseek

import express from "express";
import  {downloadVideo}  from "../controllers/video.controller";

const router = express.Router();

router.get("/download", downloadVideo);

export default router;