const { DUMMY_DATA_CLIENTS, DUMMY_DATA_PROJECTS } = require("../DUMMY_DATA/data");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList } = require("graphql");

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "Projects",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    clientId: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return DUMMY_DATA_CLIENTS.find((client) => client.id === parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    clients: {
      type: new GraphQLList(ClientType),

      resolve() {
        return DUMMY_DATA_CLIENTS;
      },
    },

    client: {
      type: ClientType,
      args: {
        id: {
          type: GraphQLID,
        },
      },

      resolve(parent, args) {
        return DUMMY_DATA_CLIENTS.find((client) => client.id === Number(args.id));
      },
    },

    projects: {
      type: new GraphQLList(ProjectType),

      resolve() {
        return DUMMY_DATA_PROJECTS;
      },
    },

    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },

      resolve(parent, args) {
        return DUMMY_DATA_PROJECTS.find((project) => project.id === Number(args.id));
      },
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    createProject: async (_, body) => {
      console.log(body);
      return body;
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
