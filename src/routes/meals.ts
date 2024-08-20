import { randomUUID } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { knex } from '../database'
import { userIdCookieExist } from '../middlewares/user-id-cookie-exist'
import moment from 'moment'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [userIdCookieExist],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const meals = await knex('meals')
        .where({ user_id: sessionId })
        .orderBy('date_time', 'desc')
        .select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [userIdCookieExist],
    },
    async (req) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(req.params)
      const { sessionId } = req.cookies

      const meals = await knex('meals')
        .where({ id, user_id: sessionId })
        .select()

      return { meals }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [userIdCookieExist],
    },
    async (req) => {
      const { sessionId } = req.cookies

      const totalMeals = await knex('meals')
        .where({ user_id: sessionId })
        .count('*', { as: 'total' })
        .first()

      const totalMealsDietTrue = await knex('meals')
        .where({ user_id: sessionId, diet: true })
        .count('diet', { as: 'total' })
        .first()

      const totalMealsDietFalse = await knex('meals')
        .where({ user_id: sessionId, diet: false })
        .count('diet', { as: 'total' })
        .first()

      const totalMealsDietSequence = await knex('meals')
        .where({ user_id: sessionId })
        .orderBy('date_time', 'desc')
        .select('diet')
        .then((sql) => {
          let count = 0
          let max = 0

          for (let i = 0; i < sql.length; i++) {
            const { diet } = sql[i]
            if (diet) {
              count += 1

              if (count > max) {
                max = count
              }
            } else {
              count = 0
            }
          }

          return { total: max }
        })

      return {
        totalMeals,
        totalMealsDietTrue,
        totalMealsDietFalse,
        totalMealsDietSequence,
      }
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [userIdCookieExist],
    },
    async (req, res) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const mealSchema = z.object({
        name: z.string().nullable().default(null),
        description: z.string().nullable().default(null),
        diet: z.boolean().nullable().default(null),
        date_time: z
          .string()
          .datetime({ offset: true })
          .nullable()
          .default(null),
      })

      const { id } = paramsSchema.parse(req.params)
      const { sessionId } = req.cookies
      const object = mealSchema.parse(req.body)

      for (const [key, value] of Object.entries(object)) {
        if (value !== null)
          await knex('meals')
            .where({ id, user_id: sessionId })
            .update(key, value)
      }

      return res.status(201).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [userIdCookieExist],
    },
    async (req, res) => {
      const paramsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = paramsSchema.parse(req.params)
      const { sessionId } = req.cookies

      await knex('meals').where({ id, user_id: sessionId }).delete()

      return res.status(204).send()
    },
  )

  app.post(
    '/',
    {
      preHandler: [userIdCookieExist],
    },
    async (req, res) => {
      const mealSchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
      })

      const { name, description, diet } = mealSchema.parse(req.body)

      const { sessionId } = req.cookies

      await knex('meals').insert({
        id: randomUUID(),
        user_id: sessionId,
        name,
        description,
        diet,
        date_time: moment().format(),
      })

      return res.status(201).send()
    },
  )
}
