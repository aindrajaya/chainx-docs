import React from "react";
import { format } from "date-fns";
import { usePluginData } from "@docusaurus/useGlobalData";

type ChangelogHeaderProps = {
  slug: string;
};

const ChangelogHeader = (props: ChangelogHeaderProps) => {
  const { slug } = props;

  const data = usePluginData("changelog-list") as
    | { frontmatter: Record<string, any> }[]
    | undefined;

  const currentChangelog = data?.find(
    (entry) => entry?.frontmatter?.slug === slug
  );

  if (!currentChangelog) {
    return null;
  }

  const formattedDate =
    currentChangelog.frontmatter?.date &&
    format(String(currentChangelog.frontmatter.date), "MMMM do, yyyy");

  return (
    <div className="!-mt-2">
      <p className="mb-2 text-black/60 dark:text-white/60">
        {formattedDate || null}
      </p>

      {currentChangelog.frontmatter?.ogImage && (
        <img
          src={currentChangelog.frontmatter.ogImage}
          alt={currentChangelog.frontmatter.title}
          width={1200}
          height={630}
          className="mb-4 mt-6 rounded-lg"
        />
      )}
    </div>
  );
};

export default ChangelogHeader;
