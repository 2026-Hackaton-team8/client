"use client";

import { Unity, useUnityContext } from "react-unity-webgl";

const BUILD_URL = "/unity/Build";

export function UnityPlayer() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: `${BUILD_URL}/build.loader.js`,
    dataUrl: `${BUILD_URL}/build.data`,
    frameworkUrl: `${BUILD_URL}/build.framework.js`,
    codeUrl: `${BUILD_URL}/build.wasm`,
    companyName: "DefaultCompany",
    productName: "SWHack",
    productVersion: "0.1.0",
  });

  return (
    <div className="relative h-full w-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p>Loading... {Math.round(loadingProgression * 100)}%</p>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        className="block h-full w-full"
        style={{ visibility: isLoaded ? "visible" : "hidden" }}
      />
    </div>
  );
}
