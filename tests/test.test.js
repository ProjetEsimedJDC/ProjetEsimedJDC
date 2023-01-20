const request = require('supertest');

test('My super test', async () => {
  const res = await request(apiUrl)
    .post('/users')
    .send({
        firstName : "test",
        lastName : "Monsieur",
        isAdmin : true,
        password : "password"
    });

  expect(res.statusCode).toEqual(201);
  // expect(res.body).toHaveProperty([]);
});