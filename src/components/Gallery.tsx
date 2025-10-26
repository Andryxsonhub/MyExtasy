// src/components/Gallery.tsx (VERSÃO FINAL CORRIGIDA)

import { useState } from "react";
import FsLightbox from "fslightbox-react";

type Photo = { url: string; thumb?: string };

type Props = { photos: Photo[] };

export default function Gallery({ photos }: Props) {
  const [toggler, setToggler] = useState(false);
  const [slide, setSlide] = useState(1);

  // A lightbox recebe SÓ as URLs (strings)
  const sources = photos.map(p => p.url);

  const openAt = (index: number) => {
    setSlide(index + 1);      // a lightbox começa em 1 (não em 0)
    setToggler(t => !t);      // isso abre a lightbox
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-8">
        {photos.map((p, i) => (
          <button key={i} onClick={() => openAt(i)} className="block">
            <img
              src={p.thumb ?? p.url}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-32 object-cover rounded"
            />
          </button>
        ))}
      </div>

      <FsLightbox
        toggler={toggler}
        slide={slide}
        sources={sources}
        // SOLUÇÃO C02: Força o FsLightbox a reconhecer todas as fontes como 'image'.
        // Isso impede a requisição XHR que falhava devido ao CORS/S3.
        types={photos.map(() => "image")} 
      />
    </>
  );
}