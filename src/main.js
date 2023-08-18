const tesseract = require("node-tesseract-ocr")
const path = require("path")

const config = {
  lang: "spa", // default
  oem: 3,
  psm: 3,
}

async function main() {
  try {
    const text = await tesseract.recognize(path.join(__dirname, "assets/tacobell.jpeg"), config)
    console.log("Result:", text)
  } catch (error) {
    console.log(error.message)
  }
}

main()