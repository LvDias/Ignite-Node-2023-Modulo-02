import fastify from 'fastify'
import cookies from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
export const server = fastify()

server.register(cookies)
server.register(usersRoutes, {
  prefix: '/users',
})
server.register(mealsRoutes, {
  prefix: '/meals',
})
