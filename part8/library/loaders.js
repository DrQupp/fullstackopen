const DataLoader = require('dataloader')
const Book = require('./models/book')

const batchUsers = async (keys) => {
  const books = await Book.find({
    author: {
      $in: keys
    }
  })

  const res = keys.map((key) => {
    return books.filter((b) => b.author.toString() === key.id.toString()).length
  })
  return res
}

const bookCountLoader = new DataLoader((authors) => {
  return batchUsers(authors)
})

module.exports = bookCountLoader
