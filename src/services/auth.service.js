import cryptoUtil from "../utils/cryto.util";
import ocrUtil from "../utils/OCR.util";
import bcrypt from "bcryptjs";
import jsonWebToken from "jsonwebtoken";
import User from "../models/user.model";

function verifyIDCard(encryptedImage) {
  const decryptedImage = cryptoUtil.decryptImageData(encryptedImage);
  const ocrResult = ocrUtil.performOCR(decryptedImage);

  if (!ocrResult) {
    return {
      data: null,
      message: "에러가 발생했습니다.",
    };
  }

  const parsedOcrResult = ocrUtil.parseKoreanIDCardOCR(ocrResult);
  console.log(ocrResult);

  return {
    data: parsedOcrResult,
    message: "비밀번호와 함께 서버로 요청을 보내주세요!!",
  };
}

function registerUser(data) {
  if (data.password !== data.passwordCheck) {
    return {
      error: "비밀번호가 다릅니다!",
    };
  }

  let user = User.findOne({ name: data.name, address: data.address });
  if (userCheck) {
    return {
      error: "이미 존재하는 회원 입니다!",
    };
  }

  user = User.create({
    name: data.name,
    birthDate: data.birthDate,
    address: data.address,
    password: bcrypt.hashSync(data.password, 10),
  });

  if (!user) {
    return {
      error: "회원가입 실패",
    };
  }
  return {
    token: jsonWebToken.sign(
      { id: user._id, name: user.name },
      process.env.SECRET_JWT_CODE,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    ),
    user: user,
  };
}

function login(data) {
  const user = User.findOne({ name: data.name, address: data.address });

  if (!user) {
    return {
      error: "로그인 실패",
    };
  }

  if (!bcrypt.compareSync(data.password, user.password)) {
    return {
      error: "비밀번호가 다릅니다",
    };
  }

  return {
    token: jsonWebToken.sign(
      { id: user._id, name: user.name },
      process.env.SECRET_JWT_CODE,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    ),
    user: user,
  };
}

function fetchByToken(req) {
  return new Promise((resolve, reject) => {
    if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authoruzation;
      let decoded;
      try {
        decoded = jsonWebToken.verify(
          authorization,
          process.env.SECRET_JWT_CODE,
        );
      } catch (err) {
        reject("Token not valid");
        return;
      }
      let userId = decoded.id;
      User.findOne({ _id: userId })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          reject("Token error");
        });
    } else {
      reject("Token not found");
    }
  });
}

module.exports = {
  verifyIDCard,
  registerUser,
  login,
  fetchByToken,
};
