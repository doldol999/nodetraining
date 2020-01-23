require('../src/db/mongoose');
const Task = require('../src/models/task');

 const deleteTask = async (id) => {
     const task = await Task.findByIdAndDelete(id);
     const count = await Task.countDocuments({compelte:false});
     return {count,task};
 }

 deleteTask('5e29c000ce24c52c105ea739')
 .then(({count,task}) => console.log(`Deleted: ${task.description}. Check for count: ${count}`))
 .catch(error => console.log(error))
 .finally(process.exit);