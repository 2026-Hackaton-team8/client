"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { unityBuild, unityModelSelector } from "@/shared/config";

type Props = {
  label: string;
  modelIndex?: number;
  className?: string;
  // Overlays drawn on top of the canvas; they stay visible in fullscreen.
  children?: ReactNode;
};

export function UnityViewer({ label, modelIndex, className, children }: Props) {
  const { unityProvider, isLoaded, loadingProgression, initialisationError, sendMessage } =
    useUnityContext(unityBuild);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const percent = Math.round(loadingProgression * 100);

  useEffect(() => {
    if (!isLoaded || modelIndex === undefined) return;
    sendMessage(unityModelSelector.objectName, unityModelSelector.method, String(modelIndex));
  }, [isLoaded, modelIndex, sendMessage]);

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  // Fallback when the browser refuses the Fullscreen API (embedded webviews): cover the window.
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsExpanded(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  const isFull = isFullscreen || isExpanded;

  function toggleFullscreen() {
    if (isExpanded) return setIsExpanded(false);
    if (document.fullscreenElement) return void document.exitFullscreen();
    containerRef.current?.requestFullscreen().catch(() => setIsExpanded(true));
  }

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      className={`overflow-hidden bg-secondary-100 ${
        isExpanded ? "fixed inset-0 z-50" : "relative"
      } ${isFull ? "" : `rounded-lg ${className ?? ""}`}`}
    >
      <Unity
        unityProvider={unityProvider}
        tabIndex={0}
        className={`size-full ${isLoaded ? "" : "invisible"}`}
      />
      {isLoaded && children}
      {isLoaded && (
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-pressed={isFull}
          className="absolute top-4 right-4 flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-label-md text-black shadow-sm hover:bg-secondary-50 focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            {isFull ? (
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
            ) : (
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            )}
          </svg>
          {isFull ? "전체화면 끝내기" : "전체화면"}
        </button>
      )}
      {!isLoaded && (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
        >
          {initialisationError ? (
            <p className="text-body-md text-secondary-700">3D 모델을 불러오지 못했어요.</p>
          ) : (
            <>
              <p className="text-body-sm text-secondary-700">3D 모델 불러오는 중 {percent}%</p>
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-secondary-200">
                <div
                  className="h-full bg-primary-500 transition-[width]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
