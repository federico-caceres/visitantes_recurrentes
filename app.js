const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const hbs = require('hbs')
const app = express();

app.set('views', path.join(__dirname));
app.set('view engine', 'hbs');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-2', { useNewUrlParser: true })
.then(() => console.log('Connected!'));


const visitorSchema = new mongoose.Schema(
    { 
        name: String, 
        count: Number 
    });
    
let Visitor = mongoose.model('Visitor', visitorSchema);


app.get('/', async (req, res) => {

    let nameVisitor = req.query.name ? req.query.name : 'Anónimo';

    try {
        const visitor = await Visitor.findOne({ "name": nameVisitor });
        if (visitor && nameVisitor != 'Anónimo') 
        {
            visitor.count++;
            await visitor.save();
        }else{
            await Visitor.create({name: nameVisitor, count: 1});
        }

        const allVisitor = await Visitor.find();
        res.render("views/main", {allVisitor:allVisitor});

    } catch (error) {
        console.log(error)
    }

});

app.listen(3000, () => console.log('Listening on port 3000!'));