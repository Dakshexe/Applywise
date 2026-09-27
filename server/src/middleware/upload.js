import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.join(__dirname, "../../uploads/resumes");

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${req.user._id}-${Date.now()}-${safe}`);
  },
});

function fileFilter(_req, file, cb) {
  const ok = [".pdf", ".doc", ".docx"].includes(path.extname(file.originalname).toLowerCase());
  if (!ok) {
    return cb(new Error("Resume must be a PDF or Word document"));
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
