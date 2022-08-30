const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } = require("graphql");
const mongoose = require("mongoose");

const Project = require("../models/Project");
const Client = require("../models/Client");

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
      // resolve(parent, args) {
      //   return Client.findById(parent.clientId);
      // },
    },
  }),
});

const ProjectDeleteType = new GraphQLObjectType({
  name: "ProjectDelete",
  fields: () => ({
    ids: {
      type: new GraphQLList(GraphQLString),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: () => ({
    clients: {
      type: new GraphQLList(ClientType),

      resolve() {
        return Client.find();
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
        return Client.findById(args.id);
      },
    },

    projects: {
      type: new GraphQLList(ProjectType),

      async resolve() {
        const response = await Project.find().populate("client").exec();

        return response;
      },
    },

    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },

      async resolve(parent, args) {
        try {
          const response = await Project.findById(args.id).populate("client");

          return response;
        } catch (err) {
          throw new Error(err);
        }
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
          type: GraphQLNonNull(GraphQLString),
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

      async resolve(parent, args) {
        try {
          const existingProject = await Project.find({ name: args.name });
          const client = await Client.findById(args.clientId);

          existingProject?.forEach((project) => {
            if (project.client.equals(client.id)) {
              throw new Error(
                `A project called '${args.name}' already exist for ${client.name}, please try a different name`
              );
            }
          });

          const newProject = {
            ...args,
            client: args.clientId,
          };

          const response = await Project.create(newProject);

          return {
            id: response.id,
          };
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    deleteProjects: {
      type: new GraphQLList(ProjectDeleteType),

      args: {
        ids: {
          type: new GraphQLList(GraphQLNonNull(GraphQLID)),
        },
      },

      async resolve(_parent, args) {
        try {
          await Project.deleteMany({ _id: { $in: args.ids } }).exec();

          // TODO: Fix this reponse
          return args.ids;
        } catch (err) {
          throw new Error(err);
        }
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
