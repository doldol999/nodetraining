// Object Property Shorthand
const name = 'Mark'
const userAge = 27

const user = {
    name,
    age: userAge,
    location: 'Philippines'
}

console.log(user);

// Object Destructuring
const product = {
    label: 'Rice',
    price: 50,
    stock: 100,
    salePrice(){
        return this.price - ( this.price * .5 );
    },
    rating: 5.32
}

// const label = product.label
// const stock = product.stock

// const {label: productLabel,rating = 5,stock} = product
// console.log(productLabel,'|',stock,'|',rating);

const transaction = (type,{label,stock}) => {
    console.log(type,label,stock);
}

transaction('order',product);