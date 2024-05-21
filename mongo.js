const mongoose = require('mongoose');


const password = process.argv[2];
const username = process.argv[3];
const phoneNumber = process.argv[4];
const url = `mongodb+srv://ZGong:${password}@cluster0.5xybshu.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;



mongoose.set('strictQuery', false);
mongoose.connect(url);

//// Defines schema
const noteSchema = new mongoose.Schema({
 name: String,
 phoneNumber: Number,
});
const Note = mongoose.model('Note', noteSchema);
////


//// Retrieves notes from the database
if (!username && !phoneNumber) {
 Note.find({}).then(result => {
   console.log("phonebook:");
   result.forEach(item => {
     console.log(`${item.name} ${item.phoneNumber}`);
   });
   mongoose.connection.close();
 });
}
////

//// Uploads note to database
if (username && phoneNumber) {
 const note = new Note({
   name: username,
   phoneNumber: phoneNumber,
 });
 note.save().then(result => {
   console.log(`added ${username} number ${phoneNumber} to phonebook`);
   mongoose.connection.close();
 });
}
////