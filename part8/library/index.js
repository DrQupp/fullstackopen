const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const Genre = require('./models/genre')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [Genre!]!
    id: ID!
  }
  
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: Genre!
    id: ID!
  }

  type Genre {
    name: String!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allGenres: [Genre!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
  }
`

const addGenre = async (genreName) => {
  const genre = new Genre({
    name: genreName
  })
  try {
    await genre.save()
  }
  catch (error) {
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
      const books = await Book.find(findCondition).populate('genres').populate('author')
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
      await Promise.all(args.genres.map(async (g) => {
        var genre = await Genre.findOne({ name: g })
        if (!genre) {
          genre = await addGenre(g)
        }
        genres = genres.concat(genre)
      }))

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
      var favoriteGenre = await Genre.findOne({name: args.favoriteGenre})
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate('favoriteGenre')
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
