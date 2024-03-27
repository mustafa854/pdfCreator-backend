const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

require("dotenv").config();




const multer = require("multer");
const upload = multer({ dest: "tmp/uploads" });
const path = require("path");

<<<<<<< HEAD
const fs = require("fs");
const directoryPath = "/tmp/uploads";

if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

=======
>>>>>>> parent of 99bc26f (removed uploads/ and added code to create uploads/ if doesn't exists)
const mongoose = require("mongoose");
const {
  createOriginalPDF,
  getOriginalPDF,
  generatePDF,
} = require("./utils/originalPDF");
// const getOriginalPDF = require("./utils/originalPDF");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("connected to db..."))
  .catch((e) => console.error("Some error occured", e));

app.post("/upload", upload.single("pdfFile"), function (req, res, next) {
  console.log(req.file, req.body);
  // // path.join(__dirname, "uploads")
  try {
    createOriginalPDF(req.file.filename, req.file.originalname);
    console.log("asndjasndjns");
    res.json({
      docId: req.file.filename,
      docName: req.file.originalname,
      createdAt: "",
    });
    console.log(
      "----------------------------------------------------------asndjasndjns"
    );
  } catch (e) {
    console.error(e);
  }
});

app.get("/upload/:id", (req, res) => {
  getOriginalPDF(req.params.id)
    .then((response) => {
      if (response) {
        res.json(response);
      } else {
        res.status(404).send();
      }
    })
    .catch((e) => {});
});

app.post("/generate-pdf", async (req, res) => {
  console.log(req.body);
  const response = await generatePDF(
    req.body.newName,
    req.body.selectedPages,
    req.body.originalPdfId
  )
    .then((response) => {
      console.log("----------------------------completed", response);
      res.send(response);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("Internal Server error!");
    });
});

app.use("/tmp/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/message", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// app.get("/", async (req, res) => {
//   createOriginalPDF();
//   console.log("hi");
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`listening to port ${PORT}...`);
});
