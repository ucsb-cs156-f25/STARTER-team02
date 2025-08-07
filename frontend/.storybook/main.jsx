/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    ],
  framework: {
    name: '@storybook/react-vite', 
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;
