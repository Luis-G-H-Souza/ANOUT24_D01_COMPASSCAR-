module.exports = (app) => {
  const update = async (id, item) => {
    console.log(item)
    if (item.length > 5) {
      return { error: 'items must be a maximum of 5' }
    }
    if (!item || !Array.isArray(item) || item.length === 0) {
      return { error: 'items is required' }
    }

    const invNames = item
      .map(item => item.name && item.name.trim())
      .filter(name => !name || name === '')
    if (invNames.length > 0) {
      return { error: 'items is required' }
    }

    for (const i of item) {
      const carExist = await app.db('cars')
        .where({ id: i.car_id })
        .first()
      console.log('Conteudo do carExist', carExist)

      if (carExist === undefined || carExist === null) {
        // console.log('Conteudo do carExist', carExist)
        return { error: 'car not found' }
      }
    }

    for (const i of item) {
      const itemExist = await app.db('cars_items')
        .where({ name: i.name, car_id: i.car_id })
        .first()

      if (itemExist) {
        return { error: 'items cannot be repeated' }
      }
    }
    try {
      const result = await app.db('cars_items').insert(item)

      const newItem = await app.db('cars_items').where({ id: result[0] }).first()

      return newItem
    } catch (error) {

    }
  }
  return { update }
}
