const add = (a,b) => {
    return new Promise((resolve,reject) => {
        setTimeout(()=>{
            resolve(a+b);
        },2000);
    })
}

add(1,2)
.then((sum)=>{ console.log(sum); return add(sum,4); }) //continue the chain by returning a new Promise
.then((sum)=>{ console.log(sum) })
.catch((error) => { console.log(error) });