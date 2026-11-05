import type { UnityConfig } from "react-unity-webgl";

// Unity WebGL build copied into public/unity/Build. Replace these files when a new build is exported.
const buildUrl = "/unity/Build";
const buildName = "2345690";

export const unityBuild: UnityConfig = {
  loaderUrl: `${buildUrl}/${buildName}.loader.js`,
  dataUrl: `${buildUrl}/${buildName}.data`,
  frameworkUrl: `${buildUrl}/${buildName}.framework.js`,
  codeUrl: `${buildUrl}/${buildName}.wasm`,
  streamingAssetsUrl: "/unity/StreamingAssets",
  companyName: "DefaultCompany",
  productName: "SWHack",
};

// Web ↔ Unity bridge. SendMessage targets the GameObject name, not the UnityWebBridge component, so
// this must match the scene object exactly (typo included) until it's renamed in Unity.
export const unityBridge = {
  objectName: "==== UNITY WEB BRIGE ====",
  setEquipment: "SetEquipment",
  selectPart: "SelectPart",
};
