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

        // console.log(response[0]);

        return response;
      },
    },

    project: {
      type: ProjectType,
      args: {
        id: { type: GraphQLID },
      },

      resolve(parent, args) {
        return Project.findById(args.id);
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
