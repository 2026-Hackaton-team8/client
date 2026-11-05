import type { UnityConfig } from "react-unity-webgl";

// Unity WebGL build copied into public/unity/Build. Replace these files when a new build is exported.
const buildUrl = "/unity/Build";
const buildName = "12312312313";

export const unityBuild: UnityConfig = {
  loaderUrl: `${buildUrl}/${buildName}.loader.js`,
  dataUrl: `${buildUrl}/${buildName}.data`,
  frameworkUrl: `${buildUrl}/${buildName}.framework.js`,
  codeUrl: `${buildUrl}/${buildName}.wasm`,
  streamingAssetsUrl: "/unity/StreamingAssets",
  companyName: "DefaultCompany",
  productName: "SWHack",
};

// Web → Unity bridge. Browser SendMessage can only pass a string or float, so the scene needs a
// GameObject named `objectName` with `public void SelectModelFromWeb(string index)` that calls
// SelectModelByIndex(int.Parse(index)). The build ships models 0–6.
export const unityModelSelector = {
  objectName: "WebBridge",
  method: "SelectModelFromWeb",
};
