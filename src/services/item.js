module.exports = (app) => {
  const update = async (id, item) => {
    const result = await app.db('cars_items').insert(item)

    const newItem = await app.db('cars_items').where({ id: result[0] }).first()

    return newItem
  }
  return { update }
}
