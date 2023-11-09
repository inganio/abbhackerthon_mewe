import jsonWebToken from "jsonwebtoken";

function check(req, res, next) {
  if (req.headers && req.headers.authorization) {
    let authorization = req.headers.authoruzation;
    let decoded;
    try {
      decoded = jsonWebToken.verify(authorization, process.env.SECRET_JWT_CODE);
    } catch (err) {
      reject("Token not valid");
      req.userId = null;
      next();
    }
    let userId = decoded.id;
    req.userId = userId;
    next();
  }
}

module.exports = { check };
