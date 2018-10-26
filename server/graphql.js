import bcrypt from 'bcrypt-nodejs';
import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

// Queries
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getUsername: {
      type: GraphQLString,
      resolve: ({ session }) => {
        if (session.isLoggedIn) return session.username;
        return null;
      }
    }
  }
});

// Mutations
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    loginUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: ({ session }, { username, password }) => new Promise((resolve) => {
        // Password: testpass
        const correctPassword = '$2a$08$7OBLs4B/PZvSxafCdjIE8.qost5k7QSyS7tUlgPi0ckDpOYYNAhC.';

        bcrypt.compare(password, correctPassword, (err, res) => {
          if (err) {
            console.error('Couldn\'t compare password hashes.');
            resolve(false);
          }

          if (res === true) {
            session.isLoggedIn = true;
            session.username = username;

            resolve(session.isLoggedIn);
          } else {
            resolve(false);
          }
        });
      })
    },
    logoutUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ session }) => {
        session.isLoggedIn = false;
        return session.isLoggedIn;
      }
    }
  }
});

export default new GraphQLSchema({ query: queryType, mutation: mutationType });
