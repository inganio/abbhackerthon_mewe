import authService from "../services/auth.service";

async function patchIdcard(req, res, next) {
  if (!req.body.imageData) {
    return res.status(400).json({ error: "Image data is missing." });
  }

  const { data, message } = authService.verifyIDCard(req.body.imageData);

  return res.json({
    data: data,
    message: message,
  });
}

async function postPassword(req, res, next) {
  if (!req.body.data) {
    return res.status(400).json({ error: "registry data is required!!" });
  }

  const registryData = req.body.data;
  const registerResult = authService.registerUser(registryData);

  if (registerResult.error) {
    return res.status(400).json({
      error: registerResult.error,
    });
  }

  return res.json({
    data: registerResult,
    message: `${registerResult.name}님 가입을 환영합니다!!`,
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
