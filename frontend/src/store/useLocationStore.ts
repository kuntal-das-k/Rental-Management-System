import { create } from 'zustand';

interface LocationState {
  city: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  isDetecting: boolean;
  error: string | null;
  detectGPSLocation: () => Promise<void>;
  setLocation: (city: string, pincode: string, address?: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: 'Mumbai',
  pincode: '400001',
  latitude: 19.0760,
  longitude: 72.8777,
  address: 'Mumbai, Maharashtra',
  isDetecting: false,
  error: null,

  detectGPSLocation: async () => {
    if (!navigator.geolocation) {
      set({ error: 'Geolocation is not supported by your browser', isDetecting: false });
      return;
    }

    set({ isDetecting: true, error: null });

    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          try {
            // Reverse geocode via OpenStreetMap Nominatim free API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();

            const detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.suburb ||
              data.address?.state_district ||
              'Current Location';
            const detectedPincode = data.address?.postcode || '400001';
            const fullAddr = data.display_name || `${detectedCity}, ${data.address?.state || ''}`;

            set({
              city: detectedCity,
              pincode: detectedPincode,
              latitude: lat,
              longitude: lng,
              address: fullAddr,
              isDetecting: false,
              error: null,
            });
          } catch {
            // Fallback if reverse geocoding request fails
            set({
              city: 'Detected Area',
              pincode: '400001',
              latitude: lat,
              longitude: lng,
              address: `GPS (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
              isDetecting: false,
              error: null,
            });
          }
          resolve();
        },
        (err) => {
          let errorMsg = 'Failed to fetch GPS location';
          if (err.code === err.PERMISSION_DENIED) {
            errorMsg = 'GPS Permission denied. Please enter your city/pincode manually.';
          }
          set({ isDetecting: false, error: errorMsg });
          resolve();
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },

  setLocation: (city: string, pincode: string, address?: string) => {
    set({
      city,
      pincode,
      address: address || `${city} (${pincode})`,
      error: null,
    });
  },
}));
