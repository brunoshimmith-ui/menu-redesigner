import { useEffect, useState } from "react";
import {
  getMunicipioAtual,
  subscribeMunicipio,
  setMunicipioAtual,
  MUNICIPIOS,
  type Municipio,
  type MunicipioId,
} from "@/lib/municipios";

export function useMunicipio() {
  const [municipio, setMunicipio] = useState<Municipio>(() => getMunicipioAtual());

  useEffect(() => {
    return subscribeMunicipio(() => setMunicipio(getMunicipioAtual()));
  }, []);

  return {
    municipio,
    municipios: MUNICIPIOS,
    setMunicipio: (id: MunicipioId) => setMunicipioAtual(id),
  };
}
