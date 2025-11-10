import React, { useEffect, useState, type ComponentType } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import type { ReferenceProps } from "@scalar/api-reference-react";

type ApiReferenceComponent = ComponentType<ReferenceProps>;

type ScalarRouteProps = {
  route: {
    configuration?: ReferenceProps["configuration"];
  };
};

const ScalarReferenceInner = ({ route }: ScalarRouteProps) => {
  const [ApiReferenceReact, setApiReferenceReact] =
    useState<ApiReferenceComponent | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@scalar/api-reference-react")
      .then((mod) => {
        if (mounted) {
          setApiReferenceReact(() => mod.ApiReferenceReact);
        }
      })
      .catch((error) => {
        console.error("Unable to load Scalar API reference bundle", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ApiReferenceReact) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading API Reference...
      </div>
    );
  }

  return <ApiReferenceReact configuration={route?.configuration} />;
};

const ScalarApiReference = (props: ScalarRouteProps) => (
  <Layout>
    <BrowserOnly fallback={<div>Loading API Reference...</div>}>
      {() => <ScalarReferenceInner {...props} />}
    </BrowserOnly>
  </Layout>
);

export default ScalarApiReference;
