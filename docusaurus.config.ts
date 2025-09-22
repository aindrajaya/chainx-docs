require("dotenv").config();

import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { ScalarOptions } from "@scalar/docusaurus";
import { downloadFile, listModels, listFiles } from "@huggingface/hub";
import { remarkCodeHike } from "@code-hike/mdx";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const date = new Date();

const month = ("0" + (date.getMonth() + 1)).slice(-2);
const day = ("0" + date.getDate()).slice(-2);
const year = date.getFullYear();

const formattedDate = `${month}-${day}-${year}`;

async function fetchDataDaily(date: string) {
  const response = await fetch(
    `https://delta.jan.ai/openai-api-collection-test/${date}.json`
  );
  if (!response.ok) {
    return {};
  }
  const data = await response.json();
  return data;
}

function generateDates(startDate: string, numberOfDays: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() - i);
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
    dates.push(formattedDate);
  }

  return dates;
}

const dateArray = generateDates(formattedDate, 30);

const config: Config = {
  title: "ChainX",
  titleDelimiter: "-",
  tagline:
    "Protect Your Contracts: Stay Secure with Smart Scans!",
  favicon: "/favicon-logo.png",
  staticDirectories: ["static"],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "changelog",
        path: "changelog",
        routeBasePath: "changelog",
      },
    ],
    "docusaurus-plugin-sass",
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },

    // Temporarily disabled due to Hugging Face rate limiting
    /*
    async function modelsPagesGenPlugin(context, options) {
      return {
        name: "list-models",
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;
          try {
            let fetchedModels = [];
            try {
              for await (const model of listModels({
                search: { owner: "cortexso" },
              })) {
              try {
                const files = [];
                let readmeContent = "README.md not available";
                let modelContent = "model.yml not available";
                for await (const fileInfo of listFiles({
                  repo: model.name,
                })) {
                  files.push(fileInfo);
                  if (fileInfo.path === "README.md") {
                    try {
                      const response = await downloadFile({
                        repo: model.name,
                        path: "README.md",
                      });
                      if (response && response.text) {
                        readmeContent = await response.text();
                      }
                    } catch (error) {
                      console.warn(`Error fetching README for ${model.name}:`, error.message);
                    }
                  }
                  if (fileInfo.path === "model.yml") {
                    try {
                      const response = await downloadFile({
                        repo: model.name,
                        path: "model.yml",
                      });
                      if (response && response.text) {
                        modelContent = await response.text();
                      }
                    } catch (error) {
                      console.warn(`Error fetching model.yml for ${model.name}:`, error.message);
                    }
                  }
                }
                try {
                  let refs = {};
                  const response = await fetch(
                    `https://huggingface.co/api/models/${model.name}/refs`
                  );
                  refs = await response.json();
                  fetchedModels.push({
                    ...model,
                    files,
                    readmeContent,
                    modelContent,
                    ...refs,
                  });
                } catch (error) {
                  console.warn(`Error fetching refs for ${model.name}:`, error.message);
                  fetchedModels.push({
                    ...model,
                    files,
                    readmeContent,
                    modelContent,
                  });
                }
              } catch (error) {
                console.warn(`Error fetching files for ${model.name}:`, error.message);
                fetchedModels.push({
                  ...model,
                  files: [],
                  readmeContent: "Error fetching README.md",
                  modelContent: "Error fetching model.yml",
                  error: "Error fetching files",
                });
              }
            }
            } catch (error) {
              console.warn("Error fetching models from Hugging Face:", error.message);
              // Set empty array if we can't fetch models
              setGlobalData([]);
            }
            setGlobalData(fetchedModels);
            await Promise.all(
              fetchedModels.map(async (page) => {
                return actions.addRoute({
                  // this is the path slug
                  // you can make it dynamic here
                  path: `/models/${page.name.replace("cortexso/", "")}`,
                  // the page component used to render the page
                  component: require.resolve(
                    "./src/components/MyModelPage/index.tsx"
                  ),
                  // will only match for exactly matching paths
                  exact: true,
                  // you can use this to optionally overwrite certain theme components
                  // see here: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-blog/src/index.ts#L343
                  modules: {},
                  // any extra custom data keys are passed to the page
                  // in this case, we merge the page data together with the loaded content data
                  customData: { ...page },
                });
              })
            );
          } catch (error) {
            console.error("Error fetching models:", error);
          }
        },
      };
    },
    */

    // Temporarily disabled to debug server startup
    /*
    async function getChangelogList(context, options) {
      return {
        name: "changelog-list",
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;

          let changelog = [];

          const changelogDir = path.resolve(__dirname, "changelog");
          const files = fs.readdirSync(changelogDir);

          // Loop through all .mdx files in the changelog directory
          files.forEach(async (file) => {
            if (file.endsWith(".mdx")) {
              const filePath = path.join(changelogDir, file);
              const fileContent = fs.readFileSync(filePath, "utf-8");

              const { data, content } = matter(fileContent);

              changelog.push({
                frontmatter: data, // Frontmatter metadata (e.g., title, date)
                body: content, // The actual MDX content
              });
            }
          });
          changelog.sort(
            (a, b) =>
              new Date(b.frontmatter.date).getTime() -
              new Date(a.frontmatter.date).getTime()
          );
          setGlobalData(changelog);
        },
      };
    },
    */

    // Temporarily disabled to debug server startup
    /*
    async function getRepoInfo(context, options) {
      return {
        name: "repo-info",
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;
          const fetchRepoInfo = await fetch(
            "https://api.github.com/repos/janhq/cortex.cpp"
          );
          const repoInfo = await fetchRepoInfo.json();
          setGlobalData(repoInfo);
        },
      };
    },
    async function getRepoLatestReleaseInfo(context, options) {
      return {
        name: "latest-release",
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;
          const fetchLatestRelease = await fetch(
            "https://api.github.com/repos/janhq/cortex.cpp/releases/latest"
          );
          const latestRelease = await fetchLatestRelease.json();
          setGlobalData(latestRelease);
        },
      };
    },
    async function getDataOAITotalCoverage(context, options) {
      return {
        name: "oai-total-coverage",
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;
          const fetchTotalCoverage = await fetch(
            "https://delta.jan.ai/openai-api-collection-test/total-coverage.json"
          );
          const totalCoverage = await fetchTotalCoverage.json();
          setGlobalData(totalCoverage);
        },
      };
    },
    async function getDataOAIDaily(context, options) {
      return {
        name: "oai-daily-report",
        async contentLoaded({ content, actions }) {
          const { setGlobalData } = actions;

          let results = [];
          for (let date of dateArray) {
            try {
              let data = await fetchDataDaily(date);
              results.push({ date: date, ...data } as never);
            } catch (error) {
              results.push({ date: date } as never);
            }
          }

          setGlobalData(results as []);
        },
      };
    },
    */
    [
      "./src/plugins/scalar/index.ts",
      {
        label: "API Reference",
        showNavLink: false,
        route: "/api-reference",
        configuration: {
          spec: {
            url: "/openapi/chainx.json",
          },
          hideModels: true,
        },
      } as ScalarOptions,
    ],
    "docusaurus-plugin-dotenv",
  ],

  scripts: [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${process.env.GTM_ID}`,
      async: true,
    },
    {
      src: "/js/gtag.js",
      async: false,
    },
  ],

  // Set the production url of your site here
  url: "https://docs.chainx.id",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  themes: ["live-codeblock", "@docusaurus/theme-mermaid"],

  markdown: {
    format: "detect",
    mermaid: true,
  },

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Aruskoding", // Usually your GitHub org/user name.
  projectName: "Chainx", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          beforeDefaultRemarkPlugins: [
            [
              remarkCodeHike,
              {
                theme: "dark-plus",
                showCopyButton: true,
                skipLanguages: ["mermaid"],
              },
            ],
          ],
          sidebarPath: "./sidebars.ts",
        },
        sitemap: {
          changefreq: "daily",
          priority: 1.0,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        theme: {
          customCss: [
            require.resolve("@code-hike/mdx/styles.css"),
            "./src/styles/main.css",
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    algolia: {
      appId: process.env.ALGOLIA_APP_ID || "XXX",
      apiKey: process.env.ALGOLIA_API_KEY || "XXX",
      indexName: "cortex",
      contextualSearch: true,
      insights: true,
    },

    metadata: [
      {
        name: "description",
        content:
          "ChainX is a robust Smart Contract Security Scanner for blockchain developers to analyze and secure their smart contracts. It is equipped with an intuitive web-based dashboard and supports integration with popular blockchain development environments. ChainX can function as an independent auditing tool or be embedded within existing DevOps pipelines. Its roadmap includes expanding to support more blockchain platforms and advanced threat detection algorithms.",
      },
      {
        name: "og:description",
        content:
          "ChainX is a robust Smart Contract Security Scanner for blockchain developers to analyze and secure their smart contracts. It is equipped with an intuitive web-based dashboard and supports integration with popular blockchain development environments. ChainX can function as an independent auditing tool or be embedded within existing DevOps pipelines. Its roadmap includes expanding to support more blockchain platforms and advanced threat detection algorithms.",
      },
    ],

    headTags: [
      // Declare some json-ld structured data
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Organization",
          name: "ChainX",
          url: "http://chainx.id/",
          logo: "",
        }),
      },
    ],

    image: "img/social-card-chainx.png", //this code still not work properly
    navbar: {
      logo: {
        alt: "Chainx Logo",
        src: "/main-logo-light.svg",
        srcDark: "/main-logo.svg",
        width: 116,
      },
      items: [
        // { to: "/models", label: "Models", position: "left" },
        // { to: "/changelog", label: "Changelog", position: "left" },
        {
          type: "doc",
          position: "right",
          docId: "overview",
          label: "Docs",
        },
        {
          to: "/api-reference",
          label: "API Reference",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },

      ],
    },
    footer: {
      links: [
        {
          title: "ChainX",
          items: [
            {
              label: "Docs",
              to: "/docs",
            },
            // { to: "/docs/cli", label: "CLI" },
            { href: "/api-reference", label: "API Reference" },
            // { to: "/models", label: "Models" },
            // { to: "/changelog", label: "Changelog" },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Github",
              href: "https://github.com/",
            },
            {
              label: "Discord",
              href: "https://discord.gg/",
            },
            {
              label: "Twitter",
              href: "https://x.com/",
            },
            {
              label: "Linkedin",
              href: "https://www.linkedin.com/company/",
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "About",
              href: "http://chainx.id/about",
            },
            // {
            //   label: "Careers",
            //   href: "https://homebrew.bamboohr.com/careers",
            // },
          ],
        },
      ],
      logo: {
        alt: "Chainx Logo",
        src: "/main-logo-light.svg",
        srcDark: "/main-logo.svg",
        width: 64,
      },
      copyright: `©${new Date().getFullYear()} ChainX Scanner`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
