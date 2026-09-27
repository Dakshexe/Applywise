export function errorHandler(err, req, res, next) {
  if (err.name === "CastError") {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.message === "Resume must be a PDF or Word document") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "You already applied to this job" });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
}
