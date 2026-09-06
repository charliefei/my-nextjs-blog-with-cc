"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

export interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

interface ImageLightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

// Stable reference — YARL re-initializes plugins when the array identity changes.
const plugins = [Zoom, Captions];

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const t = useTranslations("lightbox");

  const slides = useMemo(
    () =>
      image
        ? [
            {
              src: image.src,
              alt: image.alt,
              title: image.title || image.alt || undefined,
              description:
                image.width && image.height
                  ? `${image.width} × ${image.height}`
                  : undefined,
            },
          ]
        : [],
    [image],
  );

  return (
    <Lightbox
      open={!!image}
      close={onClose}
      slides={slides}
      plugins={plugins}
      labels={{
        Close: t("close"),
        "Zoom in": t("zoomIn"),
        "Zoom out": t("zoomOut"),
      }}
    />
  );
}
