const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection string
const mongoDB = "mongodb+srv://aniketsoni3529:PPr7GbeGCE1pFJKt@cluster0.ltankc4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log('Server is Up');
    next();
});

// Connect to MongoDB
mongoose.connect(mongoDB)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Not Connected', err));

// Define Mongoose schema and model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    course: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ "message": "Deployed Successfully" });
});

app.get('/showuser', async (req, res) => {
    try {
        const DBusers = await User.find({});
        res.status(200).send(DBusers);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.route('/user/:id')
    .get(async (req, res) => {
        try {
            const person = await User.findById(req.params.id);
            if (!person) return res.status(404).json({ error: "User not found" });
            res.status(200).json(person);
        } catch (err) {
            res.status(500).send(err);
        }
    })
    .patch(async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).send({ error: "Name is required" });
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
            if (!updatedUser) return res.status(404).send({ error: "User not found" });

            res.send(updatedUser);
        } catch (err) {
            res.status(400).send(err);
        }
    })
    .delete(async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).send({ error: "User not found" });
            res.status(200).send(deletedUser);
        } catch (err) {
            res.status(500).send(err);
        }
    });

app.post('/postuser', async (req, res) => {
    try {
        const { name, course } = req.body;
        if (!name || !course) {
            return res.status(400).send("All fields are required...");
        }

        const result = await User.create({ name, course });
        console.log("Result: ", result);
        res.status(201).json({ "message": "Created Successfully" });
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server is Running at ${port}`);
});
