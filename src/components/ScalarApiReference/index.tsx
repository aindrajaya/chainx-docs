import React, { useCallback, useEffect, useRef, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import { useColorMode, type ColorMode } from "@docusaurus/theme-common";

type ScalarConfiguration = {
  spec?: {
    url?: string;
    content?: unknown;
  };
  [key: string]: unknown;
};

type ScalarRouteProps = {
  route: {
    configuration?: ScalarConfiguration;
  };
};

const SCRIPT_ID = "scalar-api-reference-script";
const CONFIG_NODE_ID = "api-reference";
const STATIC_SCRIPT_SRC = "/vendor/scalar/api-reference.js";

const ScalarReferenceInner = ({ route }: ScalarRouteProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { colorMode, setColorMode } = useColorMode();
  const [scalarTheme, setScalarTheme] = useState<ColorMode>(colorMode);
  const suppressBodyObserverRef = useRef(false);
  const scriptLoadingRef = useRef(false);
  const baseConfigurationRef = useRef<ScalarConfiguration>(
    route?.configuration ?? {}
  );

  useEffect(() => {
    baseConfigurationRef.current = route?.configuration ?? {};
  }, [route?.configuration]);

  const prepareConfigurationPayload = useCallback(
    (mode: ColorMode) => {
      const configClone: ScalarConfiguration = JSON.parse(
        JSON.stringify(baseConfigurationRef.current ?? {})
      );

      if (typeof configClone.spec?.content === "function") {
        configClone.spec.content = configClone.spec.content();
      }

      const documentString =
        configClone?.spec?.content != null
          ? typeof configClone.spec.content === "string"
            ? configClone.spec.content
            : JSON.stringify(configClone.spec.content)
          : "";

      if (configClone?.spec?.content) {
        delete configClone.spec.content;
      }

      configClone.darkMode = mode === "dark";

      return {
        configuration: configClone,
        documentString,
      };
    },
    []
  );

  const mountScalar = useCallback(
    (mode: ColorMode) => {
      if (typeof document === "undefined") {
        return;
      }

      const container = containerRef.current;
      if (!container || !route?.configuration) {
        return;
      }

      let configNode = document.getElementById(CONFIG_NODE_ID);
      if (!configNode) {
        configNode = document.createElement("script");
        configNode.id = CONFIG_NODE_ID;
        configNode.type = "application/json";
        container.appendChild(configNode);
      }

      const { configuration, documentString } = prepareConfigurationPayload(
        mode
      );

      configNode.dataset.configuration = JSON.stringify(configuration)
        .split('"')
        .join("&quot;");
      configNode.innerHTML = documentString;

      const scriptLoaded = document.body.getAttribute("data-scalar-loaded");

      if (scriptLoaded) {
        document.dispatchEvent(new Event("scalar:reload-references"));
        document.dispatchEvent(
          new CustomEvent("scalar:update-references-config", {
            detail: { configuration },
          })
        );
        return;
      }

      if (
        document.getElementById(SCRIPT_ID) ||
        scriptLoadingRef.current
      ) {
        return;
      }

      scriptLoadingRef.current = true;
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = STATIC_SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        document.body.setAttribute("data-scalar-loaded", "true");
        scriptLoadingRef.current = false;
      };
      script.onerror = (error) => {
        console.error("Error loading Scalar script:", error);
        scriptLoadingRef.current = false;
      };
      container.appendChild(script);
    },
    [prepareConfigurationPayload, route?.configuration]
  );

  useEffect(() => {
    mountScalar(scalarTheme);
  }, [mountScalar, scalarTheme]);

  useEffect(() => {
    if (scalarTheme === colorMode) {
      return;
    }

    suppressBodyObserverRef.current = true;
    setScalarTheme(colorMode);

    const timer = window.setTimeout(() => {
      suppressBodyObserverRef.current = false;
    }, 100);

    return () => window.clearTimeout(timer);
  }, [colorMode, scalarTheme]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const body = document.body;
    if (!body) {
      return;
    }

    let previousIsDark = body.classList.contains("dark-mode");

    const observer = new MutationObserver(() => {
      const isDarkNow = body.classList.contains("dark-mode");

      if (isDarkNow === previousIsDark || suppressBodyObserverRef.current) {
        previousIsDark = isDarkNow;
        return;
      }

      previousIsDark = isDarkNow;
      const nextMode: ColorMode = isDarkNow ? "dark" : "light";

      if (scalarTheme !== nextMode) {
        setScalarTheme(nextMode);
      }

      if (colorMode !== nextMode) {
        setColorMode(nextMode);
      }
    });

    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [colorMode, scalarTheme, setColorMode]);

  useEffect(() => {
    return () => {
      if (typeof document === "undefined") {
        return;
      }

      document.dispatchEvent(new Event("scalar:destroy-references"));
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="api-reference-container"
      style={{ minHeight: "400px" }}
    />
  );
};

const ScalarApiReference = (props: ScalarRouteProps) => (
  <Layout>
    <BrowserOnly fallback={<div>Loading API Reference...</div>}>
      {() => <ScalarReferenceInner {...props} />}
    </BrowserOnly>
  </Layout>
);

export default ScalarApiReference;
