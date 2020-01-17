/**
*  Create file with given file name.
*  Check if file exists or not.
*  Append 10 lines of text to the file.
*/

const fs = require('fs');

function createAndWriteFileSync(fileName){
    for(var i = 0; i < 10; i++){
        try{
            if(i<1){fs.appendFileSync(fileName,`${i+1}: -----Appended content-----`);}
            else{fs.appendFileSync(fileName,`\n${i+1}: -----Appended content-----`)}
        }catch(error){
            console.log(`Error Found: \n${error}\n Creating File now.`);
            fs.writeFileSync(fileName,'');
            createAndWriteFileSync(fileName);
        }
    }
}

createAndWriteFileSync('newNotes.txt');