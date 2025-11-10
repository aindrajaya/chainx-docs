import type { LoadContext, Plugin } from "@docusaurus/types";
import path from "path";

export type ScalarConfiguration = Record<string, unknown>;

export type ScalarOptions = {
  label: string;
  route: string;
  showNavLink?: boolean;
  configuration?: ScalarConfiguration;
};

/**
 * Used to set default options from the user-provided options
 * This is also useful to ensure backwards compatibility with older configs that don't have the new options
 */
const createDefaultScalarOptions = (options: ScalarOptions): ScalarOptions => ({
  showNavLink: true,
  ...options,
});

/**
 * Scalar's Docusaurus plugin for Api References
 */
function ScalarDocusaurusCustomPlugin(
  context: LoadContext,
  options: ScalarOptions
): Plugin<ScalarOptions> {
  const defaultOptions = createDefaultScalarOptions(options);

  return {
    name: "@scalar/docusaurus",

    async loadContent() {
      return defaultOptions;
    },

    async contentLoaded({ content, actions }) {
      const { addRoute } = actions;

      // If showNavLink is true, add a link to the navbar
      if (defaultOptions.showNavLink) {
        (
          context.siteConfig.themeConfig.navbar as {
            items: Record<string, string>[];
          }
        ).items.push({
          to: defaultOptions.route ?? "/scalar",
          label: defaultOptions.label ?? "Scalar",
          position: "left",
        });
      }

      addRoute({
        path: defaultOptions.route,
        component: path.resolve(
          __dirname,
          "../../components/ScalarApiReference"
        ),
        // Provide the path to the loaded spec as a prop to your component
        exact: true,
        ...content,
      });
    },
  };
}

export default ScalarDocusaurusCustomPlugin;
