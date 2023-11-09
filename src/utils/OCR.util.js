import tesseract from "node-tesseract";

function performOCR(image) {
  return new Promise((resolve, reject) => {
    tesseract.process(image, (err, text) => {
      if (err) {
        console.log("OCR Error: ", err);
        reject("OCR Error");
      } else {
        console.log("OCR Result: ", text);
        resolve(text);
      }
    });
  });
}

function parseKoreanIDCardOCR(ocrText) {
  const keyValuePairs = {};

  // Define key-value extraction patterns for specific fields
  const patterns = [
    { key: "성명", regex: /성명: (.*)/ },
    { key: "주민등록번호", regex: /주민등록번호: (.*)/ },
    { key: "생년월일", regex: /생년월일: (.*)/ },
    { key: "주소", regex: /주소: (.*)/ },
    { key: "발급일자", regex: /발급일자: (.*)/ }, // Pattern for "발급일자" (issue date)
    // Add more patterns for other fields as needed
  ];

  // Iterate through patterns and extract key-value pairs
  patterns.forEach((pattern) => {
    const match = ocrText.match(pattern.regex);
    if (match) {
      keyValuePairs[pattern.key] = match[1].trim();
    }
  });

  return keyValuePairs;
}

module.exports = {
  performOCR,
  parseKoreanIDCardOCR,
};
