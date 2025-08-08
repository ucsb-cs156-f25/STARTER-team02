/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;