import { Worker } from "bullmq";
import IORedis from "ioredis";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// -------------------------------
// 1. Redis Connection
// -------------------------------
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// -------------------------------
// 2. Worker Implementation
// -------------------------------
const worker = new Worker(
  "renderQueue",
  async (job) => {
    console.log("🎬 Rendering animation job:", job.id);

    // Destructure dynamic labels from job.data
    const { labels } = job.data; 
    // Expected format: { left: "Client", mid: "Server", topRight: "Cache", bottomRight: "Database" }

    // Create temp Python script
    const tempScript = path.join("src", "renders", `scene_${job.id}.py`);

    const pythonScene = `
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Labels
        labels = ${JSON.stringify(labels)}

        # Boxes
        left = Rectangle(width=3, height=1.3).set_fill(BLUE, opacity=1).set_stroke(WHITE, 3).to_edge(LEFT).shift(UP*0.5)
        left_text = Text(labels.get("left","Client"), font_size=24).move_to(left.get_center())
        
        mid = Rectangle(width=3, height=1.3).set_fill(GREEN, opacity=1).set_stroke(WHITE, 3).shift(RIGHT*0.2)
        mid_text = Text(labels.get("mid","Server"), font_size=24).move_to(mid.get_center())
        
        topRight = Rectangle(width=3, height=1.3).set_fill(ORANGE, opacity=1).set_stroke(WHITE, 3).to_edge(RIGHT).shift(UP*1)
        top_text = Text(labels.get("topRight","Cache"), font_size=24).move_to(topRight.get_center())
        
        bottomRight = Rectangle(width=3, height=1.3).set_fill(RED, opacity=1).set_stroke(WHITE, 3).to_edge(RIGHT).shift(DOWN*1)
        bottom_text = Text(labels.get("bottomRight","Database"), font_size=24).move_to(bottomRight.get_center())

        # Add boxes to scene
        self.add(left, left_text, mid, mid_text, topRight, top_text, bottomRight, bottom_text)

        # Arrows
        arr1 = Arrow(left.get_right(), mid.get_left())
        arr2 = Arrow(mid.get_right(), topRight.get_left())
        arr3 = Arrow(mid.get_right(), bottomRight.get_left())

        self.play(Create(arr1), Create(arr2), Create(arr3))
        self.wait(2)
`;

    fs.writeFileSync(tempScript, pythonScene);

    // Output folder
    const outputDir = path.join("src", "renders", `output_${job.id}`);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // Run Manim
    return new Promise((resolve, reject) => {
      const manimProcess = spawn("manim", [
        tempScript,
        "GeneratedScene",
        "-qk",
        "-o",
        `video_${job.id}.mp4`,
        "--media_dir",
        outputDir,
      ]);

      manimProcess.stdout.on("data", (data) => console.log(`MANIM: ${data}`));
      manimProcess.stderr.on("data", (data) => console.error(`MANIM ERROR: ${data}`));

      manimProcess.on("close", (code) => {
        console.log(`Manim finished with code ${code}`);

        if (code === 0) {
          resolve({
            videoPath: path.join(outputDir, "videos", "GeneratedScene", `video_${job.id}.mp4`),
          });
        } else {
          reject(new Error("Manim failed to render."));
        }
      });
    });
  },
  { connection }
);

// -------------------------------
// 3. Worker Event Handlers
// -------------------------------
worker.on("ready", () => console.log("✅ Render Worker is READY and connected to Redis"));
worker.on("completed", (job) => console.log(`🎉 Job ${job.id} COMPLETED`));
worker.on("failed", (job, err) => console.error(`❌ Job ${job.id} FAILED:`, err));
