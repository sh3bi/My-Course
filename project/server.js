const multer = require("multer");
const upload = multer({ dest: "HTML/uploads/" });
const fs = require("fs");
const { body, validationResult } = require('express-validator');


const express = require("express");
const app = express();
const port = 3000; 

const mysql = require("mysql");
const { Console } = require("console");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "myproject",
  port: 3307,
});


app.use("/", express.static("./HTML"));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/insert", [
  body('name').trim().isLength({ min: 1, max: 50 }).withMessage('Name is required and must be between 1 and 50 characters'),
  ], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const data = { name: req.body.name };
  const query = "INSERT INTO courses SET ?";

  pool.query(query, data, (error, result) => {
    if (error) throw error;

    res.send("Data inserted successfully!");
  });
});

app.get("/view", (req, res) => {
  const query = "SELECT * FROM courses";

  pool.query(query, (error, result) => {
    if (error) throw error;

    res.json(result);
  });
});

app.post("/id", (req, res) => {
  const id = req.body.id;

  console.log(`Received button ID: ${id}`);

  res.send("Button ID received successfully!");
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  const query = "DELETE FROM courses WHERE id = ?";

  pool.query(query, id, (error, result) => {
    if (error) throw error;

    res.send("Course deleted successfully!");
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/addSlide", upload.single("slideFile"), [

  body('course_id').trim().notEmpty().withMessage('Course ID is required'),
  body('slideName').trim().notEmpty().withMessage('Slide name is required'),
  body('slideFile').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('Slide file is required');
    }
    return true;
  }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const course_id = req.body.course_id;
  const slideName = req.body.slideName;
  const slideFile = req.file;


  const filePath = slideFile.path;
  

  const uploadPath = "HTML/uploads/" + slideFile.originalname;

  const file_path = "uploads/" + slideFile.originalname;

  fs.copyFile(filePath, uploadPath, (error) => {
    if (error) {
      throw error;
    }

    const query =
      "INSERT INTO files (course_id, name, file_path) VALUES (?, ?, ?)";
    const values = [course_id, slideName, file_path];

    pool.query(query, values, (error, result) => {
      if (error) throw error;

      res.send("Slide added successfully!");
    });
  });
});

app.post("/addLink", [
  body('course_id').trim().notEmpty().withMessage('Course ID is required'),
  body('linkUrl').trim().notEmpty().withMessage('Link URL is required').isURL().withMessage('Invalid URL'),
  body('linkName').trim().notEmpty().withMessage('Link name is required').isLength({ max: 250 }).withMessage('Link name must be at most 250 characters'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const course_id = req.body.course_id;
  const linkUrl = req.body.linkUrl;
  const linkName = req.body.linkName;

  const query = "INSERT INTO links (course_id, link_url, name) VALUES (?, ?, ?)";
  const values = [course_id, linkUrl, linkName];

  pool.query(query, values, (error, result) => {
    if (error) throw error;

    res.send("Link added successfully!");
  });
});


/*================================================================================================*/


app.get("/getSlides", (req, res) => {
  const course_id = req.query.course_id;
  const query = "SELECT * FROM files WHERE course_id = ?";

  pool.query(query, course_id, (error, result) => {
    if (error) throw error;

    res.json(result);
  });
});

app.get("/getLinks", (req, res) => {
  const course_id = req.query.course_id;
  const query = "SELECT * FROM links WHERE course_id = ?";

  pool.query(query, course_id, (error, result) => {
    if (error) throw error;

    res.json(result);
  });
});


/*================================================================================================*/


app.post("/deleteSlide", (req, res) => {
  const id = req.body.id;
  const query = "DELETE FROM files WHERE id = ?";

  pool.query(query, id, (error, result) => {
    if (error) throw error;

    res.send("Slide deleted successfully!");
  });
});

app.post("/deleteLink", (req, res) => {
  const id = req.body.id;
  const query = "DELETE FROM links WHERE id = ?";

  pool.query(query, id, (error, result) => {
    if (error) throw error;

    res.send("Link deleted successfully!");
  });
});
