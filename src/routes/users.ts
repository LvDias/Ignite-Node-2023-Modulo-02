import { FastifyInstance } from 'fastify'
import { knex } from '../database'

import { z } from 'zod'
import { userIdCookieExist } from '../middlewares/user-id-cookie-exist'
import { userIdCookieCreate } from '../utils/user-id-cookie-create'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [userIdCookieExist],
    },
    async () => {
      const users = await knex('users').select('name', 'age', 'weight')

      return { users }
    },
  )

  app.post('/register', async (req, res) => {
    const userSchema = z.object({
      name: z.string(),
      age: z.number(),
      weight: z.number(),
      email: z.string().email(),
      password: z.string(),
    })

    const { name, age, weight, email, password } = userSchema.parse(req.body)

    const sessionId = await userIdCookieCreate(req, res)

    await knex('users').insert({
      id: sessionId,
      name,
      age,
      weight,
      email,
      password,
    })

    return res.status(201).send()
  })

  app.post('/login', async (req, res) => {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = userSchema.parse(req.body)

    const user = await knex('users')
      .where({
        email,
        password,
      })
      .select()
      .first()

    userIdCookieCreate(req, res)

    return { user }
  })
}
