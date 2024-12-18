import { useState } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const getLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        setState(prev => ({
          ...prev,
          error: "Geolocalização não é suportada pelo navegador",
          loading: false,
        }));
        reject("Geolocalização não suportada");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Posição GPS capturada:", position.coords);
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false,
          });
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao capturar GPS:", error);
          setState(prev => ({
            ...prev,
            error: "Não foi possível obter sua localização",
            loading: false,
          }));
          reject(error);
        }
      );
    });
  };

  return {
    ...state,
    getLocation,
  };
};