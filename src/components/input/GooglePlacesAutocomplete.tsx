import { Autocomplete, Box, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface PlaceResult {
  formatted_address: string;
  latitude: number;
  longitude: number;
  place_id: string;
  name: string;
}

interface GooglePlacesAutocompleteProps {
  value: PlaceResult | null;
  onChange: (place: PlaceResult | null) => void;
  label?: string;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  googleMapsLoaded?: boolean; // NEW: Wait for Google Maps to load
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  label = 'Location',
  placeholder = 'Search for a location...',
  tooltip,
  required = false,
  googleMapsLoaded = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const sessionToken = useRef<any>(null);

  useEffect(() => {
    // Initialize Google Places services ONLY after Google Maps is loaded
    if (!googleMapsLoaded) {
      return; // Wait until Google Maps script is loaded
    }

    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();

      // Create a dummy div for PlacesService (it requires a map or div)
      const dummyDiv = document.createElement('div');
      placesService.current = new (window as any).google.maps.places.PlacesService(dummyDiv);

      // Create a new session token for billing optimization
      sessionToken.current = new (window as any).google.maps.places.AutocompleteSessionToken();
    }
  }, [googleMapsLoaded]); // Re-run when googleMapsLoaded changes

  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setOptions([]);
      return;
    }

    if (!autocompleteService.current) {
      console.error('Google Places Autocomplete service not loaded');
      return;
    }

    setLoading(true);

    const request = {
      input: inputValue,
      sessionToken: sessionToken.current || undefined,
    };

    autocompleteService.current.getPlacePredictions(request, (predictions: any, status: any) => {
      setLoading(false);

      if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
        setOptions(predictions);
      } else {
        setOptions([]);
      }
    });
  }, [inputValue]);

  const handleSelect = async (prediction: any) => {
    if (!prediction || !placesService.current) {
      onChange(null);
      return;
    }

    // Get detailed place information including coordinates
    const request = {
      placeId: prediction.place_id,
      fields: ['geometry', 'formatted_address', 'name', 'place_id'],
      sessionToken: sessionToken.current || undefined,
    };

    placesService.current.getDetails(request, (place: any, status: any) => {
      if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
        const result: PlaceResult = {
          formatted_address: place.formatted_address || prediction.description,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          place_id: place.place_id || prediction.place_id,
          name: place.name || prediction.structured_formatting.main_text,
        };

        onChange(result);

        // Create a new session token after successful selection
        sessionToken.current = new (window as any).google.maps.places.AutocompleteSessionToken();
      } else {
        console.error('Error getting place details:', status);
        onChange(null);
      }
    });
  };

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#374151',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </Typography>
      )}

      <Autocomplete
        value={value}
        onChange={(_, newValue) => {
          handleSelect(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options}
        loading={loading}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          if ('formatted_address' in option) return (option as PlaceResult).formatted_address;
          return option.description || '';
        }}
        renderOption={(props, option) => {
          const prediction = option;
          return (
            <li {...props} key={prediction.place_id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <FaMapMarkerAlt size={16} color="#9ca3af" />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{prediction.structured_formatting?.main_text || ''}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6b7280' }}>{prediction.structured_formatting?.secondary_text || ''}</Typography>
                </Box>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#CD1B78',
                },
              },
            }}
          />
        )}
        noOptionsText={inputValue.length < 3 ? 'Type at least 3 characters...' : 'No locations found'}
        filterOptions={(x) => x} // Disable built-in filtering since Google handles it
      />

      {tooltip && (
        <Typography variant="caption" sx={{ color: '#6b7280', mt: 0.5, display: 'block' }}>
          {tooltip}
        </Typography>
      )}

      {value && (
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#374151', mb: 0.5 }}>Selected Location:</Typography>
          <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 0.5 }}>{value.formatted_address}</Typography>
          <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>
            Coordinates: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GooglePlacesAutocomplete;
