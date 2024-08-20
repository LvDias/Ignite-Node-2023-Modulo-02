import {
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
} from 'vitest'
import request from 'supertest'
import { server as app } from '../src/app'
import { execSync } from 'node:child_process'

describe('[ROUTE] - MEALS', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all')
  })

  it('should be able to create a new meal', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: true,
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: 1,
        date_time: expect.any(String),
        created_at: expect.any(String),
      }),
    ])
  })

  it('should be able to get a meal with id', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: 1,
        date_time: expect.any(String),
        created_at: expect.any(String),
      }),
    ])

    const listMealsIdResponse = await request(app.server)
      .get(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsIdResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: 1,
        date_time: expect.any(String),
        created_at: expect.any(String),
      }),
    ])
  })

  it('should be able to edit a meal', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: 1,
        date_time: expect.any(String),
        created_at: expect.any(String),
      }),
    ])

    await request(app.server)
      .put(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set('Cookie', cookies)
      .send({
        name: 'Almoço na casa da vó',
        description:
          'Lasanha de carne moída, macarrão ao molho de tomate e frango recheado com batata',
        diet: false,
      })
      .expect(201)

    const listMealsEditedResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsEditedResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        name: 'Almoço na casa da vó',
        description:
          'Lasanha de carne moída, macarrão ao molho de tomate e frango recheado com batata',
        diet: 0,
        date_time: expect.any(String),
        created_at: expect.any(String),
      }),
    ])
  })

  it('should be able to delete a meal', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: true,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        user_id: expect.any(String),
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: 1,
        date_time: expect.any(String),
        created_at: expect.any(String),
      }),
    ])

    await request(app.server)
      .delete(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should be able to get summary of meals', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço em casa',
        description: 'Arroz, feijão, frango, ovo e salada',
        diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Janta na pizzaria',
        description: 'Comi um rodizío de pizzas',
        diet: false,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Almoço no serviço',
        description: 'Marmita com arroz, feijão e frango',
        diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da tarde',
        description: '1 Banana, 1 maça e 2 laranja',
        diet: true,
      })
      .expect(201)

    const listMealsSummaryResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsSummaryResponse.body).toEqual({
      totalMeals: {
        total: 4,
      },
      totalMealsDietTrue: {
        total: 3,
      },
      totalMealsDietFalse: {
        total: 1,
      },
      totalMealsDietSequence: {
        total: 2,
      },
    })
  })
})
