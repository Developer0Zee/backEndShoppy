import jwt from "jsonwebtoken"; 

const secretKey = "Zeeshan"; //secretKey to match from the server

export function verify(req, res, next) { //middleware to verify and protecting cart routes
  const header = req.headers.authorization; //getting token from header

  if (!header) return res.status(404).json({ message: "header file missing" });

  const extractedToken = header.split(" ")[1]; //selecting token only

  try {
    const verification = jwt.verify(extractedToken, secretKey); //verifying it using secretKey
    req.user = verification; //setting to user
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
