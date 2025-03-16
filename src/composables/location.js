import startMarker from "@/assets/img/start-pin.png";
import stopMarker from "@/assets/img/stop-pin.png";
import {Loader} from "@googlemaps/js-api-loader";
import mapStyle from "@/assets/mapStyle.json";


export const initMap = async (coordinates, mapContainerRef, mapRef, iconStyle = null) => {

  const getIconStyle = () => {
    if (!iconStyle) {
      return [startMarker, stopMarker]
    } else {
      return [iconStyle]
    }
  }

  const icons = getIconStyle()

  const loader = new Loader({
    apiKey: "AIzaSyDNGIcQN-8_fVZnEDk6URTk11PlZTS6dPY",
    version: "weekly",
  });

  await loader.load();

  mapRef.value = new google.maps.Map(mapContainerRef.value, {
    center: coordinates[0],
    zoom: 16,
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: false,
  });

  coordinates.forEach((coord, index) => {
    new google.maps.Marker({
      position: coord,
      map: mapRef.value,
      title: `Localization ${index + 1}`,
      icon: icons[index],
      animation: google.maps.Animation.DROP
    });
  });

  if (coordinates.length === 2) {
    const bounds = new google.maps.LatLngBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    mapRef.value.fitBounds(bounds, 50);
  }

  mapRef.value.setCenter(coordinates[0]);

  return mapRef
};