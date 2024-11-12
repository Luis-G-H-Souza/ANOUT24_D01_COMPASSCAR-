module.exports = (app) => {
  const update = async (id, item) => {
    const carExist = await app.db('cars')
      .where({ id })
      .first()
    if (carExist === undefined || carExist === null) {
      return { error: ['car not found'] }
    }

    if (!item || !Array.isArray(item) || item.length === 0) {
      return { error: ['items is required'] }
    }

    const emptyItems = item.filter(item => !item || item.trim() === '')
    if (emptyItems.length > 0) {
      return { error: ['items is required'] }
    }
    if (item.length > 5) {
      return { error: ['items must be a maximum of 5'] }
    }

    const itemExist = await app.db('cars_items')
      .whereIn('name', item)
      .andWhere('car_id', id)
      .select('*')
    if (itemExist.length > 0) {
      return { error: ['items cannot be repeated'] }
    }

    try {
      const insertitems = item.map(i => ({ name: i, car_id: id }))
      await app.db('cars_items').insert(insertitems)
      return undefined
    } catch (error) {

    }
  }
  return { update }
}
