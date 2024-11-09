function validation (car) {
  const err = []
  const day = new Date()
  const maxyear = day.getFullYear() + 1
  const minyear = maxyear - 10

  if (!car.brand) {
    err.push('brand is required')
  }
  if (!car.model) {
    err.push('model is required')
  }
  if (!car.year) {
    err.push('year is required')
  }
  if (!car.plate) {
    err.push('plate is required')
  } else if (car.plate.length !== 8) {
    err.push('plate must be in the correct format ABC-1C34')
  } else {
    const valplate = car.plate.split('')
    const firstarray = valplate.slice(0, 3)
    const num = valplate.slice(4, 5)
    const letter = valplate.slice(5, 6)
    const lastarray = valplate.slice(6)
    const asciiletter = []
    const asciinum = []

    const allNumbers = num.concat(lastarray)
    const allLetters = firstarray.concat(letter)

    for (let i = 0; i < 4; i++) {
      const ascii = allLetters[i].charCodeAt(0)

      asciiletter.push(ascii)
    }
    for (let i = 0; i < 3; i++) {
      const ascii1 = allNumbers[i].charCodeAt(0)

      asciinum.push(ascii1)
    }
    const valNumber = asciinum.every(ascii => ascii >= 48 && ascii <= 57)
    const valLetter = asciiletter.every(ascii => ascii >= 65 && ascii <= 90)
    if (!valNumber) { err.push('plate must be in the correct format ABC-1C34') }
    if (!valLetter) { err.push('plate must be in the correct format ABC-1C34') }
  }

  if (car.year > maxyear || car.year < minyear) {
    err.push(`year must be between ${minyear} and ${maxyear}`)
  }
  return err
}
module.exports = { validation }
