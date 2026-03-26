const express = require('express');
const app = express();

app.use(express.json());
app.use('/users', require('./routes/userRoutes'));

app.get('/', (req, res) => res.json({ message: 'BuyerForeSight API running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));