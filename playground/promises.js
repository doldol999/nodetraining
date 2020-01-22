const doWorkPromise = new Promise((resolve,reject) => {
    setTimeout(()=>{
        // resolve('Resolved');
        reject('Rejected');
    },2000);
});

doWorkPromise.then((val) => { console.log(val) }).catch((err) => { console.log(err) });

// > 'Rejected'