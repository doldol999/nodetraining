require('../src/db/mongoose');
const User = require('../src/models/user');

const _id = '5e28c1c73321622628b1dbf9';

const chainedVersion = () => {
    User.findByIdAndUpdate(_id,{ age: 55 })
    .then((user)=>{ 
        console.log(user);
        return User.countDocuments({ age: 55 })
    }).then((result)=>{ console.log(result) })
    .catch((error)=>{ console.log(error) })
    .finally(()=>{ process.exit() });
}

const updateAgeAndCount = async (id,age) => {
    const user = await User.findByIdAndUpdate(id,{ age });
    const count = await User.countDocuments({ age });
    return count;
}