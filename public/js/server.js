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
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    // Basic validation (you can enhance this as needed)
    if (!username || !password) {
        return res.send('Please fill out all fields.');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send('User already exists.');
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        // Redirect to login page after successful registration
        console.log('User registered successfully');
        res.redirect('/login.html'); // Adjust this path if needed
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
        const user = await User.findOne({ username: email, password: psw });
        if (!user) {
            return res.send('Invalid email or password.');
        }

        // Redirect to a success page or dashboard
        console.log('Logged in')
        res.redirect('/index.html'); // Adjust this path if needed
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.json(users); // Send users as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving users');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});