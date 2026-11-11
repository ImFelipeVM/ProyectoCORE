import { BUILDINGS, VALLEY, WORLD_NPCS, WORLD_OBJECTS } from '../data/valley.js';
import { JOURNEY_STATIONS, nextJourneyStation, stationIsComplete } from '../data/journey.js';

export function createWorldNavigationState(player = {}, position = { x: 0, y: 0 }) {
  const journey = player.journey || {};
  const hasEpisode1 = Array.isArray(player.completedEpisodes) && player.completedEpisodes.includes(1);
  const currentStation = hasEpisode1 ? nextJourneyStation(journey) : null;
  const home = WORLD_OBJECTS.find(item => item.id === 'homeDoor');
  const target = !hasEpisode1 && home
    ? { id: home.id, x: home.x, y: home.y, name: 'LA CASA · EPISODIO 1', kind: 'objective' }
    : currentStation
      ? { id: currentStation.id, x: currentStation.x, y: currentStation.y, name: currentStation.title, kind: 'objective' }
      : null;

  const stations = JOURNEY_STATIONS.map((station, index) => {
    const visited = hasEpisode1 && stationIsComplete(journey, station.id) && Boolean(journey.resolvedStations?.[station.id]);
    return {
      ...station,
      kind: 'station',
      status: visited ? 'visited' : currentStation?.id === station.id ? 'current' : 'locked',
      order: index + 1
    };
  });

  const markers = [
    ...WORLD_OBJECTS.map(item => ({ ...item, markerType: 'poi' })),
    ...WORLD_NPCS.map(person => ({ ...person, markerType: 'npc' })),
    ...BUILDINGS.map(building => ({
      id: 'building-' + building.id,
      name: building.id === 'home' ? 'Casa' : building.id === 'school' ? 'Escuela' : 'Casa del barrio',
      x: building.doorX ?? (building.x + building.width / 2),
      y: building.y + building.height,
      markerType: 'building'
    })),
    ...stations
  ];

  return {
    position,
    target,
    currentStation,
    stations,
    markers,
    areas: VALLEY.areas.map(area => ({
      ...area,
      visited: Array.isArray(player.worldVisitedAreas) && player.worldVisitedAreas.includes(area.id)
    }))
  };
}

export function directionArrow(dx, dy) {
  if (Math.hypot(dx, dy) < 1) return '•';
  const directions = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'];
  const sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
  return directions[sector];
}

export function distanceInSteps(dx, dy) {
  return Math.max(0, Math.round(Math.hypot(dx, dy) / 32));
}
