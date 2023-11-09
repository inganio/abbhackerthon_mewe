import ocrUtil from "../utils/OCR.util";
import bcrypt from "bcryptjs";
import jsonWebToken from "jsonwebtoken";
import User from "../models/user.model";
import Wallet from "../models/wallets.model";
import axios from "axios";
import Tesseract from "tesseract.js";
import "dotenv/config";

function verifyIDCard(image) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(image, "kor", { logger: (info) => console.log(info) })
      .then(({ data: { text } }) => {
        console.log(text);
        const keyValues = ocrUtil.parseKoreanIDCardOCR(text);
        console.log(keyValues);
        resolve(keyValues);
      })
      .catch((error) => {
        console.error(error);
        reject({ status: "Error", message: "OCR processing failed" });
      });
  });
}

async function registerUser(data) {
  if (data.password !== data.passwordCheck) {
    return {
      error: "비밀번호가 다릅니다!",
    };
  }

  let user = await User.findOne({ name: data.name, address: data.address });
  if (user) {
    return {
      error: "이미 존재하는 회원 입니다!",
    };
  }

  user = await User.create({
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

  const url = "http://175.106.96.224:3398/v1/mitumt/com/acc_create";

  const response = await axios.post(url, {
    token: process.env.API_TOKEN,
    chain: "mitumt",
  });

  const walletData = response.data.data.wallet;

  console.log(walletData);

  const wallet = await Wallet.create({
    userId: user._id,
    privatekey: walletData.privatekey,
    publickey: walletData.publickey,
    address: walletData.address,
  });

  return {
    token: jsonWebToken.sign(
      { id: user._id, name: user.name },
      process.env.SECRET_JWT_CODE,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    ),
    wallet: wallet,
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
