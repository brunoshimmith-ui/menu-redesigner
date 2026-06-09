import { useEffect, useState } from "react";
import { canalStore, type CanalSlide } from "@/lib/canalPublicoStore";

export function useCanalSlides() {
  const [hero, setHero] = useState<CanalSlide[]>(() => canalStore.getHero());
  const [info, setInfo] = useState<CanalSlide[]>(() => canalStore.getInfo());

  useEffect(() => {
    return canalStore.subscribe(() => {
      setHero(canalStore.getHero());
      setInfo(canalStore.getInfo());
    });
  }, []);

  return {
    hero,
    info,
    setHero: (s: CanalSlide[]) => canalStore.setHero(s),
    setInfo: (s: CanalSlide[]) => canalStore.setInfo(s),
  };
}
