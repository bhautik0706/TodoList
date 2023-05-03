const csvModel = require("./../model/csvfileModel");
const responseHandler = require("./../utlis/responseHandler");
const csv = require("csvtojson");
exports.uploadCsv = async (req, res) => {
  try {
    csv()
      .fromFile(req.file.path)
      .then(async (csvData) => {
        const csvs = [];
        for (let i = 0; i < csvData.length; i++) {
          const csv = new csvModel({
            srno: csvData[i].srno,
            assigningto: csvData[i].assigningto,
            title: csvData[i].title,
            description: csvData[i].description,
            duedate: csvData[i].duedate,
            status: csvData[i].status,
            subtasks: [],
          });
          if (csvData[i].subtasks) {
            const subtaskIds = csvData[i].subtasks.split(",");
            csv.subtasks = subtaskIds;
            for (let j = 0; j < subtaskIds.length; j++) {
              const subtask = await csvModel.findById(subtaskIds[j]);
              subtask.parenttask = csv.id;
              await subtask.save();
            }
          }
          csvs.push(csv);
        }
        await csvModel.insertMany(csvs);
        const message = "Csv file uploaded successfully";
        responseHandler.sendSuccessResponce(res, message, csvs);
      });
  } catch (err) {
    console.log(err);
  }
};
/*const express = require("express");
const mongoose = require("mongoose");
const csvParser = require("csv-parser");
const fs = require("fs");
const Csv = require("./models/csv");
const app = express();
app.use(express.json());
mongoose.connect("mongodb://localhost/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.post("/csv", (req, res) => {
  const csvFile = req.files.csv;
  const results = [];
  fs.createReadStream(csvFile.tempFilePath)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      const tasks = results.map((row) => {
        const task = new Csv({
          srno: row.srno,
          title: row.title,
          description: row.description,
          duedate: row.duedate,
          status: row.status,
          assigningto: row.assigningto,
          subtasks: row.subtasks.split(",").map((id) => mongoose.Types.ObjectId(id)),
        });
        return task;
      });
      Csv.insertMany(tasks, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send("CSV file imported successfully");
        }
      });
    });
});
app.listen(3000, () => console.log("Server started on port 3000"));*/
