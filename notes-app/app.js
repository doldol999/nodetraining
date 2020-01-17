const yargs = require('yargs');
const notesUtil = require('./notes.js'); //from our own files

//Customize Yargs version
yargs.version('0.0.1'); //to display version node app.js --version

// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: "string"
        },
        body: {
            describe: 'Note content',
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {
        notesUtil.addNote(argv.title, argv.body);
    }
});

//Create remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: "string"
        }
    },
    handler(argv) {
        console.log('Removing the note');
        notesUtil.removeNote(argv.title);
    }
});

// Create list command
yargs.command({
    command: 'list',
    describe: 'List notes',
    handler() {
        notesUtil.listNotes();
    }
});

//Create read command
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: 'Note title',
            type: 'string',
            demandOption: true
        }
    },
    handler(argv) {
        notesUtil.readNote(argv.title)
    }
});

yargs.parse();