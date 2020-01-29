const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneID, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const response = await request(app).post('/users')
        .send({
            name: 'Mark Lumbao',
            email: 'lumbao.mark@xtendops.com',
            password: 'testuser10101'
        }).expect(201);

    //assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //assertions about the reseponse
    expect(response.body).toMatchObject({
        user: {
            name: 'Mark Lumbao',
            email: 'lumbao.mark@xtendops.com',
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('testuser10101');
});

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login')
    .send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    
    const user = await User.findById(userOneID);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login none-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'admin.mark@xtendops.com',
        password: 'testuser10100'
    }).expect(400);
});

test('Should get profile for user', async ()=>{
    await request(app).get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should note get profile for unauthenticated user', async ()=>{
    await request(app).get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
    const response = await request(app).delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
    
    const user = await User.findById(userOneID);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneID);
    expect(user.avatar).toEqual(expect.any(Buffer)); // checks if avatar is equal to a buffer object
});

test('Should update valid user fields', async () => {
    const response = await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Jaguar Paw'
    })
    .expect(200);

    const user = await User.findById(userOneID);
    expect(user.name).toEqual('Jaguar Paw');
});

test('Should not update invalid user fields', async () => {
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'Jaguar Paw'
    })
    .expect(400);
});