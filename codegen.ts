import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.WP_GRAPHQL_URL ?? "https://summitbalkans.com/graphql",
  documents: ["lib/graphql/**/*.graphql"],
  generates: {
    "./lib/gql/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
