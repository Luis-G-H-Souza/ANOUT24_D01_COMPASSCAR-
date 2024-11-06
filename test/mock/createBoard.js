function create () {
  //  const num = getRandomInt(0, 9)
  const arrayLetter = []
  const arraynum = []
  const num = [getRandomInt(0, 9)]
  const letter = [String.fromCharCode(65 + Math.floor(Math.random() * 26))]
  const less = ['-']

  for (let i = 0; i < 3; i++) {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    arrayLetter.push(letter)
  }

  for (let i = 0; i < 2; i++) {
    const num = getRandomInt(0, 9)
    arraynum.push(num)
  }
  const board = arrayLetter.concat(less, num, letter, arraynum)
  const boardResult = board.join('')
  return boardResult
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
module.exports = create
