const fs = require('fs');
const chalk = require('chalk');

const addNote = (title,body) => {
    const notes = loadNotes();
    const match = notes.find(value => value.title === title);

    if(!match){
        notes.push({
            title: title,
            body: body
        });
    
        saveNotes(notes);
        console.log(chalk.bold.green('New note saved.'));
    }else{
        console.log(chalk.bold.red('Note title taken.'));
    }
}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes);
    fs.writeFileSync('notes.json',dataJSON);
}

const loadNotes = () => {
    try{
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    }catch(err){
        return []
    }
}

const removeNote = (title) => {
    const notes = loadNotes();

    //only return items that are not equal to the given title
    const filteredNotes = notes.filter((note) => note.title !== title);

    /**if filtered has the same length with the original note list
    * then indicate that the given title is not found
    * else save the filtered note and notify the user */
    if(filteredNotes.length === notes.length){
        console.log(chalk.bold.red('Title not found!'));
    }else{
        saveNotes(filteredNotes);
        console.log(chalk.bold.green(`${title} is removed.`));
    }
}

const listNotes = () => {
    console.log(chalk.inverse.green(' Your Notes '));

    const notesData = loadNotes();

    notesData.forEach(note => {
         console.log(note.title);
    });
}

const readNote = (title) => {
    const notes = loadNotes();
    const match = notes.find(value => value.title === title);
    try{
        console.log(`${chalk.yellow.bold(match.title)}\n${match.body}`);
    }catch(e){
        console.log(chalk.red.bold('Note not Found!'));
    }
}

module.exports = {
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes,
    readNote: readNote
};