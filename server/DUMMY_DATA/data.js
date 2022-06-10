const DUMMY_DATA_PROJECTS = [
  {
    id: 1,
    name: "Project One",
    status: "In Progress",
    clientId: 1,
    description:
      "Project One Description. Project One Description. Project One Description. Project One Description. Project One Description. Project One Description.",
  },

  {
    id: 2,
    name: "Project Two",
    status: "Paused",
    clientId: 2,
    description:
      "Project Two Description. Project Two Description. Project Two Description. Project Two Description. Project Two Description. Project Two Description.",
  },

  {
    id: 3,
    name: "Project Three",
    status: "In Progress",
    clientId: 3,
    description:
      "Project Three Description. Project Three Description. Project Three Description. Project Three Description. Project Three Description. Project Three Description.",
  },

  {
    id: 4,
    name: "Project Four",
    status: "Completed",
    clientId: 3,
    description:
      "Project Four Description. Project Four Description. Project Four Description. Project Four Description. Project Four Description. Project Four Description.",
  },
];

const DUMMY_DATA_CLIENTS = [
  {
    id: 1,
    name: "Ashe",
    email: "ashe@lol.com",
  },
  {
    id: 2,
    name: "Shen",
    email: "shen@lol.com",
  },
  {
    id: 3,
    name: "Yasuo",
    email: "yasuo@lol.com",
  },
];

module.exports = {
  DUMMY_DATA_PROJECTS,
  DUMMY_DATA_CLIENTS,
};
