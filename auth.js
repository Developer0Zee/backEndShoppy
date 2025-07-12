import jwt from "jsonwebtoken";

const secretKey = "Zeeshan";

export function verify(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return res.status(404).json({ message: "header file missing" });

  const extractedToken = header.split(" ")[1];

  try {
    const verification = jwt.verify(extractedToken, secretKey);
    req.user = verification;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
