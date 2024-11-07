import { Button } from "@site/src/components/Button";

import Link from "@docusaurus/Link";

import Announcement from "@site/src/components/Announcement";

import { FaGithub } from "react-icons/fa";
import DropdownDownload from "@site/src/components/DropdownDownload";
import { usePluginData } from "@docusaurus/useGlobalData";

const SimpleHeroSection = () => {
  const latestRelease = usePluginData("latest-release");
  return (
    <div className="container">
      <div className="text-center mb-10">
        <Announcement />
      </div>

      <div className="text-center mb-20">
        <div className="w-full lg:w-1/2 mx-auto">
          <h1 className="text-4xl lg:text-6xl font-grotesk leading-tight">
            Stay Safe, Scan!
          </h1>
        </div>
        <p className="text-xl w-full mx-auto lg:w-2/3 text-black/60 dark:text-white/60">
          Powers <span className="text-black dark:text-white">👋</span> Chainx Team
        </p>

        <div className="mt-8 flex gap-8 justify-center items-center">
          {/* <DropdownDownload lastRelease={latestRelease} /> */}
          <Link href="/contact" target="_blank">
            <Button theme="secondary">Get in Touch with us</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
export default SimpleHeroSection;
