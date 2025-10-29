const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const crypto = require("crypto");

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");

const app = express();
app.use(express.json());

// Create GridFS storage engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/transetu_exercises",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage });

// File upload endpoint: POST /upload (field name: file)
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const protocol = req.protocol;
    const host = req.get("host");
    const url = `${protocol}://${host}/files/${req.file.filename}`;

    return res.status(201).json({
        message: "File uploaded to MongoDB",
        file: {
            filename: req.file.filename,
            mimetype: req.file.contentType,
            size: req.file.size,
            url
        }
    });
});

// Serve files from GridFS
app.get("/files/:filename", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const bucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: "uploads"
        });

        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

        downloadStream.on("file", (file) => {
            res.set("Content-Type", file.contentType);
        });

        downloadStream.on("error", (err) => {
            console.error(err);
            return res.status(404).json({ message: "File not found" });
        });

        downloadStream.pipe(res);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error retrieving file" });
    }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
