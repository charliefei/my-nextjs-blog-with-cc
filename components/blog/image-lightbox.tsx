"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { useMemo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  ZoomIn,
  ZoomOut,
  Download as DownloadIcon,
  Maximize,
  Minimize,
  X,
  ChevronLeft,
  ChevronRight,
  PanelBottomOpen,
  PanelBottomClose,
  Captions as CaptionsIcon,
  CaptionsOff,
} from "lucide-react";
import type { ToolbarButtonKey } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./image-lightbox.css";

export interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

interface ImageLightboxProps {
  images: readonly LightboxImage[];
  index: number;
  onClose: () => void;
}

// Stable reference — YARL re-initializes plugins when the array identity changes.
const plugins = [Zoom, Captions, Counter, Download, Fullscreen, Thumbnails];

// Visual separators between toolbar button groups. Rendered as plain nodes in
// the `toolbar.buttons` array (YARL renders non-key entries verbatim).
const divider = (key: string) => (
  <span key={key} className="yarl-toolbar-divider" aria-hidden="true" />
);

// All glyph swaps go through render.icon* slots, so the built-in buttons keep
// their disabled / active / focus behavior — only the SVG changes.
const renderIcons = {
  iconZoomIn: () => <ZoomIn strokeWidth={2.25} />,
  iconZoomOut: () => <ZoomOut strokeWidth={2.25} />,
  iconDownload: () => <DownloadIcon strokeWidth={2} />,
  iconEnterFullscreen: () => <Maximize strokeWidth={2} />,
  iconExitFullscreen: () => <Minimize strokeWidth={2} />,
  iconClose: () => <X strokeWidth={2.25} />,
  iconPrev: () => <ChevronLeft strokeWidth={2.25} />,
  iconNext: () => <ChevronRight strokeWidth={2.25} />,
  iconCaptionsVisible: () => <CaptionsIcon strokeWidth={2} />,
  iconCaptionsHidden: () => <CaptionsOff strokeWidth={2} />,
  iconThumbnailsVisible: () => <PanelBottomClose strokeWidth={2} />,
  iconThumbnailsHidden: () => <PanelBottomOpen strokeWidth={2} />,
} as const;

export function ImageLightbox({ images, index, onClose }: ImageLightboxProps) {
  const t = useTranslations("lightbox");

  const slides = useMemo(
    () =>
      images.map((image) => ({
        src: image.src,
        alt: image.alt,
        title: image.title || image.alt || undefined,
        description:
          image.width && image.height
            ? `${image.width} × ${image.height}`
            : undefined,
      })),
    [images],
  );

  const hasMultipleImages = images.length > 1;

  // Left → right: zoom group · captions / thumbnails · download / fullscreen · close.
  const toolbarButtons: (ToolbarButtonKey | ReactNode)[] = hasMultipleImages
    ? ["zoom", divider("d1"), "captions", "thumbnails", divider("d2"), "download", "fullscreen", "close"]
    : ["zoom", divider("d1"), "captions", divider("d2"), "download", "fullscreen", "close"];

  return (
    <Lightbox
      className="yarl-blog"
      open={images.length > 0}
      close={onClose}
      slides={slides}
      index={index}
      plugins={plugins}
      carousel={{
        finite: true,
        preload: 2,
      }}
      controller={{
        closeOnBackdropClick: true,
        closeOnPullDown: true,
      }}
      zoom={{
        maxZoomPixelRatio: 2,
        zoomInMultiplier: 1.6,
        doubleClickMaxStops: 2,
        scrollToZoom: true,
      }}
      captions={{
        showToggle: true,
        descriptionTextAlign: "center",
      }}
      thumbnails={{
        position: "bottom",
        width: 88,
        height: 56,
        border: 1,
        borderRadius: 10,
        padding: 2,
        gap: 10,
        showToggle: hasMultipleImages,
        // A single-image gallery has no toggle button, so the strip must
        // start hidden (display:none — the plugin keeps it mounted).
        hidden: !hasMultipleImages,
        vignette: true,
      }}
      // Counter plugin is loaded unconditionally (stable plugin list); hide
      // its pill for single-image galleries.
      counter={hasMultipleImages ? undefined : { style: { display: "none" } }}
      toolbar={{ buttons: toolbarButtons }}
      labels={{
        Close: t("close"),
        Previous: t("previous"),
        Next: t("next"),
        "Zoom in": t("zoomIn"),
        "Zoom out": t("zoomOut"),
        Download: t("download"),
        "Enter Fullscreen": t("enterFullscreen"),
        "Exit Fullscreen": t("exitFullscreen"),
        "Show captions": t("showCaptions"),
        "Hide captions": t("hideCaptions"),
        "Show thumbnails": t("showThumbnails"),
        "Hide thumbnails": t("hideThumbnails"),
      }}
      render={renderIcons}
    />
  );
}
