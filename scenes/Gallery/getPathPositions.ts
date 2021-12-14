/**
 * @todo now put the positions for the canvases
 * ... and their respective rotations
 * ... on each room. Remember to set the
 * ... [side by side] on downwards,
 * ... [downward and opposite] on corners,
 * ... [up and down] on side-lanes ------
 */

export type LaneType = "frontal" | "side-lane" | "corner";

export interface RoomPosition {
  laneType: LaneType;
  x: number;
  z: number;
}

function getRoomPosition(
  frontalSpace: number
): (seedItem: string, index: number, seedItemsList: string[]) => RoomPosition {
  return function (
    seedItem: string,
    index: number,
    seedItemsList: string[]
  ): RoomPosition {
    const highest = [...seedItemsList].sort(
      (a: string, b: string) => Number(b) - Number(a)
    )[0];
    const roomPosition: RoomPosition = {
      laneType: seedItemsList[index + 1] === seedItem ? "frontal" : "corner",
      x: Math.round(
        (Number(seedItem) / Number(highest) - 0.5) * Number(highest)
      ),
      z:
        Math.round(
          ((index + 0.5) / seedItemsList.length - 0.5) * seedItemsList.length
        ) * frontalSpace,
    };

    return roomPosition;
  };
}

function getRooms(seed: number, frontalSpace: number): RoomPosition[] {
  return String(seed).split("").map(getRoomPosition(frontalSpace));
}

function getRandomSeed(): number {
  return Math.floor(Math.random() * 1000000000000000);
}

function getRoomsWithWalkPaths(rooms: RoomPosition[]): RoomPosition[] {
  const newRooms: RoomPosition[] = [];
  for (const [index, room] of Object.entries(rooms)) {
    let lastRoom = room;
    const nextRoom = rooms[Number(index) + 1];

    newRooms.push(room);

    while (
      (nextRoom && lastRoom && lastRoom?.x !== nextRoom?.x) ||
      (lastRoom?.z !== nextRoom?.z && Number(index) < rooms.length - 1)
    ) {
      const direction = Math.sign(nextRoom.x - lastRoom.x) as -1 | 1 | 0;

      if (direction) {
        lastRoom = {
          laneType:
            lastRoom.x + direction === nextRoom.x ? "corner" : "side-lane",
          x: lastRoom.x + direction,
          z: lastRoom.z,
        };

        newRooms.push(lastRoom);

        continue;
      }

      lastRoom = {
        laneType: "frontal",
        x: lastRoom.x,
        z: lastRoom.z + 1,
      };

      if (lastRoom.z < nextRoom?.z) {
        newRooms.push(lastRoom);
      }
    }
  }

  return newRooms;
}

function getPathPositions(
  seed = getRandomSeed(),
  frontalSpace = 2
): RoomPosition[] {
  console.log(seed);
  // make sure to capture neat new good looking seeds

  const roomsPaths = getRooms(seed, frontalSpace);
  const roomsWithWalkPaths = getRoomsWithWalkPaths(roomsPaths);

  return roomsWithWalkPaths;
}

export default getPathPositions;
