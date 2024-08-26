const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Import path module for serving files
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define a simple User schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Define Feedback schema
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registration route
app.post('/register', async (req, res) => {
    const { email, psw, pswRepeat } = req.body;
    
    // Basic validation
    if (!email || !psw || !pswRepeat) {
        return res.send('Please fill out all fields.');
    }

    if (psw !== pswRepeat) {
        return res.send('Passwords do not match.');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send('User already exists.');
        }

        // Create a new user
        const newUser = new User({ email, password: psw });
        await newUser.save();

        // Redirect to login page after successful registration
        console.log('User registered successfully');
        res.redirect('/registered.html'); // Adjust this path if needed
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, psw } = req.body;

    // Basic validation
    if (!email || !psw) {
        return res.send('Please fill out all fields.');
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email, password: psw });
        if (!user) {
            return res.send('Invalid email or password.');
        }

        // Redirect to a success page or dashboard
        console.log('Logged in')
        res.redirect('/loggedin.html'); // Adjust this path if needed
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

// Feedback route
app.post('/feedback', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.send('Please fill out all fields.');
    }

    try {
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();
        console.log('Feedback received');
        res.redirect('/thankyou.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error submitting feedback');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
