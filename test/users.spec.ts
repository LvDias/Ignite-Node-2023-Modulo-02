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

describe('[ROUTE] - USERS', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)
  })

  it('should be able to login account user', async () => {
    await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 46,
        weight: 84.2,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    await request(app.server)
      .post('/users/login')
      .send({
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(200)
  })

  it('should be able to list all users', async () => {
    const createdUserResponse = await request(app.server)
      .post('/users/register')
      .send({
        name: 'Luan Vinicius Dias',
        age: 20,
        weight: 90.4,
        email: 'luanviniciusdias2003@gmail.com',
        password: '123',
      })
      .expect(201)

    const cookies = createdUserResponse.headers['set-cookie']

    const listUsersResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'Luan Vinicius Dias',
        age: 20,
        weight: 90.4,
      }),
    ])
  })
})
