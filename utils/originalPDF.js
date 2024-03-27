const fs = require("fs/promises");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { PDFDocument } = require("pdf-lib");
const originalPDF = new mongoose.Schema({
  originalPdfId: String,
  createdAt: { type: Date, default: Date.now },
  originalPdfName: String,
  newPDF: [
    {
      id: {
        type: String,
      },
      pdfName: {
        type: String,
      },
      createdAt: { type: Date },
    },
  ],
});

const PDF = mongoose.model("PDF", originalPDF);
const createOriginalPDF = async (originalPdfId, originalPdfName) => {
  let newPDF = new PDF({
    originalPdfId,
    originalPdfName,
    newPDF: [],
  });
  newPDF
    .save()
    .then((pdf) => console.log(pdf))
    .catch((e) => console.error(e));
};

const getOriginalPDF = async (originalPdfId) => {
  const originalPDF = PDF.findOne({ originalPdfId: originalPdfId });
  return originalPDF;
};

const generatePDF = async (newName, selectedPages, originalPdfId) => {
  try {
    const newPdfDoc = await PDFDocument.create();
    console.log("1");
    // const  = await PDFDocument.load();
    // const srcDoc = await PDFDocument.load(
    //   `http://localhost/uploads/${originalPdfId}`
    // );
    console.log(originalPdfId);
    const pdfData = await fs.readFile(`tmp/uploads/${originalPdfId}`);
    const srcDoc = await PDFDocument.load(pdfData);
    // console.log(srcDoc);
    const copiedPages = await newPdfDoc.copyPages(srcDoc, selectedPages);
    console.log("3");
    for (let i = 0; i < selectedPages.length; i++) {
      newPdfDoc.addPage(copiedPages[i]);
    }

    console.log("4");
    const pdfBytes = await newPdfDoc.save();
    console.log("5");

    try {
      const newFileID = crypto.randomUUID();
      await fs.writeFile(`tmp/uploads/${newFileID}.pdf`, pdfBytes);
      console.log("File saved successfully!", newFileID);
      const doc = await PDF.findOne({ originalPdfId });
      console.log(
        "-----------------------------------------------------",
        doc.newPDF
      );
      doc.newPDF.push({
        id: newFileID,
        pdfName: newName,
        createdAt: Date.now(),
      });
      console.log(
        "-----------------------------------------------------",
        doc.newPDF
      );
      await doc.save();
      console.log(doc);
      return newFileID;
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }

  /**
   *
   * SAVE TO MONGODB AND RETURN RESPONSE
   *
   */
};

module.exports = { createOriginalPDF, getOriginalPDF, generatePDF };
// module.exports = getOriginalPDF;
