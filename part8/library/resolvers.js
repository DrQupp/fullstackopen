const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const Genre = require('./models/genre')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const addGenre = async (genreName) => {
  const genre = new Genre({
    name: genreName
  })
  try {
    await genre.save()
  } catch (error) {
    throw new GraphQLError('Saving genre failed', {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: genreName,
        error
      }
    })
  }
  return genre
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      var findCondition = {}
      if (args.genre && args.author) {
        const author = await Author.findOne({ name: args.author })
        const genre = await Genre.findOne({ name: args.genre })
        findCondition = { author, genres: genre }
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author })
        findCondition = { author }
      } else if (args.genre) {
        const genre = await Genre.findOne({ name: args.genre })
        findCondition = { genres: genre }
      }
      const books = await Book.find(findCondition)
        .populate('genres')
        .populate('author')
      return books
    },
    allAuthors: async () => await Author.find({}),
    allGenres: async () => await Genre.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      return await Book.countDocuments({ author })
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      var author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({
          name: args.author
        })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      var genres = []
      await Promise.all(
        args.genres.map(async (g) => {
          var genre = await Genre.findOne({ name: g })
          if (!genre) {
            genre = await addGenre(g)
          }
          genres = genres.concat(genre)
        })
      )

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: genres,
        author: author
      })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      const newAuthor = await Author.findByIdAndUpdate(
        author._id,
        { name: author.name, born: args.setBornTo },
        { new: true }
      )
      return newAuthor
    },
    createUser: async (root, args) => {
      var favoriteGenre = await Genre.findOne({ name: args.favoriteGenre })
      if (!favoriteGenre) {
        favoriteGenre = await addGenre(args.favoriteGenre)
      }
      const user = new User({
        username: args.username,
        favoriteGenre: favoriteGenre
      })
      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
