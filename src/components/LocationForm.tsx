import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Users } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationFormProps {
  formData: {
    address: string;
    companions: string;
    latitude?: number;
    longitude?: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export const LocationForm = ({ formData, onChange }: LocationFormProps) => {
  const { latitude, longitude, error: geoError, loading } = useGeolocation();
  const [mapToken, setMapToken] = useState(localStorage.getItem('mapbox_token') || '');
  const { toast } = useToast();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapToken) return;

    mapboxgl.accessToken = mapToken;
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [formData.longitude || longitude || -43.9542, formData.latitude || latitude || -19.8157],
      zoom: 15
    });

    const newMarker = new mapboxgl.Marker()
      .setLngLat([formData.longitude || longitude || -43.9542, formData.latitude || latitude || -19.8157])
      .addTo(newMap);

    setMap(newMap);
    setMarker(newMarker);

    return () => {
      newMap.remove();
    };
  }, [mapToken, latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude && !formData.latitude && !formData.longitude) {
      onChange("latitude", latitude);
      onChange("longitude", longitude);
      updateAddress(longitude, latitude);
    }
  }, [latitude, longitude]);

  const updateAddress = async (lng: number, lat: number) => {
    if (!mapToken) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapToken}`
      );
      const data = await response.json();
      if (data.features && data.features[0]) {
        onChange("address", data.features[0].place_name);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível obter o endereço automaticamente",
        variant: "destructive",
      });
    }
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    onChange("latitude", lat);
    onChange("longitude", lng);
    marker?.setLngLat([lng, lat]);
    updateAddress(lng, lat);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mapbox_token', mapToken);
    toast({
      title: "Token salvo",
      description: "O token do Mapbox foi salvo com sucesso",
    });
  };

  if (!mapToken) {
    return (
      <form onSubmit={handleTokenSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="mapbox_token" className="text-sm font-medium">
            Token do Mapbox
          </label>
          <Input
            id="mapbox_token"
            value={mapToken}
            onChange={(e) => setMapToken(e.target.value)}
            placeholder="Insira seu token público do Mapbox"
          />
        </div>
        <Button type="submit">Salvar Token</Button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Endereço *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div id="map" className="w-full h-[300px] rounded-lg shadow-md" />

      {loading && <p>Carregando localização...</p>}
      {geoError && <p className="text-red-500">Erro ao obter localização: {geoError}</p>}

      <div className="space-y-2">
        <label htmlFor="companions" className="text-sm font-medium">
          Acompanhantes
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="companions"
            name="companions"
            value={formData.companions}
            onChange={(e) => onChange("companions", e.target.value)}
            className="pl-10"
            placeholder="Nomes separados por vírgula"
          />
        </div>
      </div>
    </div>
  );
};