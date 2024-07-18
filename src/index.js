import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import { MongoClient } from "mongodb";

const mongoClient = new MongoClient("mongodb+srv://abhishekchungade12:8208322540@cluster0.osuuxaw.mongodb.net/todo.appointments");

try {
  await mongoClient.connect();
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
} finally {
  await mongoClient.close();
}

var connectionString = "mongodb+srv://abhishekchungade12:8208322540@cluster0.osuuxaw.mongodb.net/todo.appointments";

// Root endpoint
app.get("/", (req, res) => {
    res.send("<h1>To Do - API</h1>");
});

// Get all appointments
app.get("/appointments", (req, res) => {
    mongoClient.connect(connectionString)
        .then(client => {
            const db = client.db("todo");
            db.collection("appointments").find({}).toArray()
                .then(documents => {
                    res.json(documents);
                })
                .catch(error => {
                    console.error("Error fetching appointments:", error);
                    res.status(500).send("Internal Server Error");
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch(error => {
            console.error("MongoDB connection error:", error);
            res.status(500).send("Database Connection Error");
        });
});

// Get appointment by ID
app.get("/appointments/:id", (req, res) => {
    var id = parseInt(req.params.id);
    mongoClient.connect(connectionString)
        .then(client => {
            const db = client.db("todo");
            db.collection("appointments").findOne({ Id: id })
                .then(document => {
                    if (document) {
                        res.json(document);
                    } else {
                        res.status(404).send("Appointment not found");
                    }
                })
                .catch(error => {
                    console.error("Error fetching appointment:", error);
                    res.status(500).send("Internal Server Error");
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch(error => {
            console.error("MongoDB connection error:", error);
            res.status(500).send("Database Connection Error");
        });
});

// Add a new appointment
app.post("/addtask", (req, res) => {
    var task = {
        Id: parseInt(req.body.Id),
        Title: req.body.Title,
        Date: new Date(req.body.Date),
        Description: req.body.Description
    };
    mongoClient.connect(connectionString)
        .then(client => {
            const db = client.db("todo");
            db.collection("appointments").insertOne(task)
                .then(() => {
                    console.log("Task Added Successfully..");
                    res.status(201).send("Task Added Successfully");
                })
                .catch(error => {
                    console.error("Error adding task:", error);
                    res.status(500).send("Internal Server Error");
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch(error => {
            console.error("MongoDB connection error:", error);
            res.status(500).send("Database Connection Error");
        });
});

// Edit an existing appointment
app.put("/edittask/:id", (req, res) => {
    var id = parseInt(req.params.id);
    var updatedTask = {
        Id: parseInt(req.body.Id),
        Title: req.body.Title,
        Date: new Date(req.body.Date),
        Description: req.body.Description
    };
    mongoClient.connect(connectionString)
        .then(client => {
            const db = client.db("todo");
            db.collection("appointments").updateOne({ Id: id }, { $set: updatedTask })
                .then(() => {
                    console.log("Task Updated Successfully..");
                    res.send("Task Updated Successfully");
                })
                .catch(error => {
                    console.error("Error updating task:", error);
                    res.status(500).send("Internal Server Error");
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch(error => {
            console.error("MongoDB connection error:", error);
            res.status(500).send("Database Connection Error");
        });
});

// Delete an appointment
app.delete("/deletetask/:id", (req, res) => {
    var id = parseInt(req.params.id);
    mongoClient.connect(connectionString)
        .then(client => {
            const db = client.db("todo");
            db.collection("appointments").deleteOne({ Id: id })
                .then(() => {
                    console.log("Task Deleted Successfully..");
                    res.send("Task Deleted Successfully");
                })
                .catch(error => {
                    console.error("Error deleting task:", error);
                    res.status(500).send("Internal Server Error");
                })
                .finally(() => {
                    client.close();
                });
        })
        .catch(error => {
            console.error("MongoDB connection error:", error);
            res.status(500).send("Database Connection Error");
        });
});

var port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server Started : http://127.0.0.1:${port}`);
});

