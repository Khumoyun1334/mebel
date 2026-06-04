import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FiMapPin, FiCrosshair, FiSearch } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

// Marker ikonasini to'g'irlash
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Xarita ustidagi click va drag hodisalarini boshqaruvchi komponent
function MapEvents({ onLocationSelect, markerPosition, setMarkerPosition }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      getAddressFromCoords(lat, lng, onLocationSelect);
    },
  });
  return null;
}

// Koordinatadan manzil olish (Nominatim API - bepul)
const getAddressFromCoords = async (lat, lng, onLocationSelect) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=uz`,
      {
        headers: {
          'User-Agent': 'AzizbekMebellari/1.0'
        }
      }
    );
    const data = await response.json();
    
    let fullAddress = '';
    if (data.address) {
      const parts = [];
      if (data.address.road) parts.push(data.address.road);
      if (data.address.house_number) parts.push(data.address.house_number);
      if (data.address.suburb) parts.push(data.address.suburb);
      if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
      if (data.address.state) parts.push(data.address.state);
      fullAddress = parts.join(', ');
    } else {
      fullAddress = data.display_name || `${lat}, ${lng}`;
    }
    
    const mapsLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    onLocationSelect({ lat, lng, address: fullAddress, mapsLink });
  } catch (error) {
    console.error('Manzil olishda xatolik:', error);
    const mapsLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    onLocationSelect({ lat, lng, address: `${lat}, ${lng}`, mapsLink });
  }
};

// Qidiruv komponenti
function SearchBox({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchLocation = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=uz`,
        {
          headers: {
            'User-Agent': 'AzizbekMebellari/1.0'
          }
        }
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Qidiruv xatosi:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    let fullAddress = '';
    if (result.address) {
      const parts = [];
      if (result.address.road) parts.push(result.address.road);
      if (result.address.house_number) parts.push(result.address.house_number);
      if (result.address.suburb) parts.push(result.address.suburb);
      if (result.address.city || result.address.town) parts.push(result.address.city || result.address.town);
      fullAddress = parts.join(', ');
    } else {
      fullAddress = result.display_name;
    }
    const mapsLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
    onLocationSelect({ lat, lng, address: fullAddress, mapsLink });
    setResults([]);
    setQuery('');
  };

  return (
    <div className="mb-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            placeholder="Manzil qidirish (ko'cha, tuman, shahar)..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={searchLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent"
          >
            <FiSearch size={18} />
          </button>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => selectLocation(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-all"
            >
              <p className="text-sm font-medium">{result.display_name.split(',')[0]}</p>
              <p className="text-xs text-gray-500">{result.display_name}</p>
            </button>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-2">
          <div className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-500 ml-2">Qidirilmoqda...</span>
        </div>
      )}
    </div>
  );
}

// Hozirgi joylashuvni olish tugmasi
function CurrentLocationButton({ onLocationSelect }) {
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi");
      setGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        getAddressFromCoords(lat, lng, onLocationSelect);
        setGettingLocation(false);
      },
      (error) => {
        console.error("Geolokatsiya xatosi:", error);
        alert("Joylashuvingizni aniqlab bo'lmadi. Iltimos, xaritadan tanlang.");
        setGettingLocation(false);
      }
    );
  };

  return (
    <button
      type="button"
      onClick={getCurrentLocation}
      disabled={gettingLocation}
      className="w-full bg-blue-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <FiCrosshair size={16} />
      {gettingLocation ? "Joylashuv olinmoqda..." : "📍 Hozirgi joylashuvim"}
    </button>
  );
}

// Asosiy LocationPicker komponenti
function LocationPicker({ onLocationSelect, initialLocation }) {
  const [position, setPosition] = useState(
    initialLocation 
      ? [initialLocation.lat, initialLocation.lng] 
      : [41.2995, 69.2401]  // Toshkent markazi
  );
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const mapRef = useRef(null);

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setPosition([locationData.lat, locationData.lng]);
    onLocationSelect(locationData);
    if (mapRef.current) {
      mapRef.current.setView([locationData.lat, locationData.lng], 15);
    }
  };

  return (
    <div className="space-y-3">
      {/* Qidiruv */}
      <SearchBox onLocationSelect={handleLocationSelect} />
      
      {/* Xarita */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '350px', width: '100%', borderRadius: '12px' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          </Marker>
        )}
        <MapEvents 
          onLocationSelect={handleLocationSelect}
          markerPosition={position}
          setMarkerPosition={setPosition}
        />
      </MapContainer>
      
      {/* Hozirgi joylashuv tugmasi */}
      <CurrentLocationButton onLocationSelect={handleLocationSelect} />
      
      {/* Tanlangan manzil */}
      {selectedLocation && (
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <FiMapPin className="text-green-600 mt-0.5 shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Tanlangan manzil:</p>
              <p className="text-sm text-green-700 break-words">{selectedLocation.address}</p>
              <a 
                href={selectedLocation.mapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline inline-block mt-1"
              >
                🗺️ Xaritada ko'rish
              </a>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-400 text-center">
        💡 Xaritani bosish yoki qidiruv orqali manzilni tanlang
      </p>
    </div>
  );
}

export default LocationPicker;