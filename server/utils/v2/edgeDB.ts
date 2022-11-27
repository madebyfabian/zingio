import * as edgedb from 'edgedb'

const client = edgedb.createClient()

export const edgeDB = client
