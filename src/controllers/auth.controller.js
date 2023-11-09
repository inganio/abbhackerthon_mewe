import authService from "../services/auth.service";

async function patchIdcard(req, res, next) {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "Error", message: "No file uploaded" });
  }

  const imageBuffer = req.file.buffer; // Use req.file.buffer instead of req.file.imageData

  authService
    .verifyIDCard(imageBuffer)
    .then((result) => {
      res.status(200).json({ status: "OK", result });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

async function postPassword(req, res, next) {
  if (!req.body.data) {
    return res.status(400).json({ error: "registry data is required!!" });
  }

  const registryData = req.body.data;
  const registerResult = await authService.registerUser(registryData);

  if (registerResult.error) {
    return res.status(400).json({
      error: registerResult.error,
    });
  }
  return res.json({
    data: registerResult,
    message: `${registerResult.user.name}님 가입을 환영합니다!!`,
  });
}

async function patchLogin(req, res, next) {
  if (!req.body.data) {
    res.status(400).json({
      error: "로그인 실패",
    });
  }

  const result = authService.login(req.body.data);

  return {
    data: result,
    message: `${result.name}님이 로그인 하였습니다!`,
  };
}

async function check(req, res, next) {
  authService
    .fetchByToken(req)
    .then((user) => {
      res.json({ data: user, message: "token is valid" });
    })
    .catch((err) => {
      res.statux(400).json({ message: err });
    });
}

module.exports = {
  patchIdcard,
  postPassword,
  patchLogin,
  check,
};
