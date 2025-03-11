import { Request, Response } from "express";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

export const downloadVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.query;

    // Validate URL
    if (!url || typeof url !== "string") {
      res.status(400).json({ error: "Valid YouTube URL is required" });
      return;
    }

    console.log("🔍 Fetching video details:", url);

    // Get the video title using yt-dlp
    exec(`yt-dlp --get-title "${url}"`, (error, stdout) => {
      if (error) {
        console.error("❌ Failed to fetch video title:", error);
        res.status(500).json({ error: "Failed to retrieve video title" });
        return;
      }

      // Sanitize the video title for use as a filename
      let videoTitle = stdout.trim();
      videoTitle = videoTitle.replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, "_"); // Remove invalid characters
      const outputFilename = `${videoTitle}.mp4`;
      const outputPath = path.join(__dirname, "../../videos", outputFilename);

      console.log(`📥 Downloading video as: ${outputFilename}`);

      // Download video using yt-dlp
      exec(`yt-dlp -o "${outputPath}" "${url}"`, (downloadError) => {
        if (downloadError) {
          console.error("❌ Download failed:", downloadError);
          res.status(500).json({ error: "Download failed", details: downloadError.message });
          return;
        }

        console.log("✅ Video downloaded successfully!");

        // Check if file exists before sending
        if (fs.existsSync(outputPath)) {
          // Stream the file to the client
          const fileStream = fs.createReadStream(outputPath);

          // Set headers for the download
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader("Content-Disposition", `attachment; filename="${outputFilename}"`);

          fileStream.pipe(res);

          // Clean up the file after streaming
          fileStream.on("end", () => {
            fs.unlinkSync(outputPath); // Delete the file after sending
            console.log("🗑️ File deleted after streaming.");
          });

          fileStream.on("error", (err) => {
            console.error("❌ Error streaming file:", err);
            res.status(500).json({ error: "File streaming failed", details: err.message });
          });
        } else {
          res.status(500).json({ error: "File not found after download" });
        }
      });
    });

  } catch (error: unknown) {
    console.error("❌ Unexpected error:", error);
    res.status(500).json({ error: "Internal Server Error", details: (error as Error).message });
  }
};