const { DUMMY_DATA_CLIENTS, DUMMY_DATA_PROJECTS } = require("../DUMMY_DATA/data");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } = require("graphql");
const { default: mongoose } = require("mongoose");

const Project = require("../models/Project");

const db = mongoose.connection;

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
        return Project.find();
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
    createProject: {
      type: ProjectType,

      args: {
        clientId: {
          type: GraphQLNonNull(GraphQLID),
        },
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        status: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLString,
        },
      },

      async resolve(_parent, args) {
        const existingProject = await Project.find({ name: args.name }).exec();

        if (existingProject) {
          throw new Error(`A project called '${args.name}' already exist, please try a different name`);
        }

        const data = Project.create(args);
        return data;
      },
    },

    deleteProject: {
      type: ProjectType,

      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },

      async resolve(_parent, args) {
        const project = await Project.findByIdAndDelete(args.id).exec();

        if (!project) {
          throw new Error(`Project not found`);
        }

        return project;
      },
    },

    updateProject: {
      type: ProjectType,

      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },

        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        status: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLString,
        },
      },

      async resolve(_parent, args) {
        console.log(args);
        const existingProject = await Project.find({ name: args.name }).exec();

        if (existingProject?.length) {
          throw new Error(`A project called '${args.name}' already exist, please try a different name`);
        }

        const project = await Project.findByIdAndUpdate(args.id, args).exec();

        return { ...project, ...args };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
