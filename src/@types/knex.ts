// eslint-disable-next-line
import { knex } from '../database'

declare module 'knex/types/tables' {
  interface Users {
    id: string
    name: string
    age: number
    weight: number
    email: string
    password: string
    created_at: string
  }

  interface Meals {
    id: string
    user_id: string
    name: string
    description: string
    diet: boolean
    date_time: string
    created_at: string
  }

  interface Tables {
    users: Users
    meals: Meals
  }
}
