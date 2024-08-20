import { randomUUID } from 'node:crypto'

import { FastifyReply, FastifyRequest } from 'fastify'

export async function userIdCookieCreate(
  req: FastifyRequest,
  res: FastifyReply,
) {
  if (req.cookies.sessionId)
    return res.status(401).send({
      error: 'Unauthorized!',
    })

  const sessionId = randomUUID()
  res.setCookie('sessionId', sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return sessionId
}
