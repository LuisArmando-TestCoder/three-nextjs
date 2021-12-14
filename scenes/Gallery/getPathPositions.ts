export type LaneType = "frontal" | "side-lane" | "corner";

export interface PlainVector {
  x: number;
  z: number;
}

export interface RoomPosition extends PlainVector {
  laneType: LaneType;
}

export interface WalkPath extends RoomPosition {
  displays?: {
    position?: PlainVector;
    rotation?: number;
  }[];
}

export type LaneName =
  | "frontal0"
  | "frontal1"
  | "side-lane0"
  | "side-lane1"
  | "corner0"
  | "corner1";

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
  return Math.floor(Math.random() * 1e16);
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

function getCornerPosition({
  index,
  axis,
  displayIndex,
  roomsWithWalkPaths,
}: {
  index: number;
  axis: "x" | "z";
  displayIndex: number;
  roomsWithWalkPaths: RoomPosition[];
}): number {
  const cornerPosition =
    roomsWithWalkPaths[index][axis] -
    (roomsWithWalkPaths[index + Math.sign(displayIndex - 0.5)]?.[axis] ??
      roomsWithWalkPaths[index][axis]);

  return cornerPosition;
}

function getCornerRotation(
  roomsWithWalkPaths: RoomPosition[],
  index: number,
  displayIndex: number
): number {
  return (
    (Math.PI / 2) *
    (displayIndex +
      (+(
        roomsWithWalkPaths[index + 1].laneType === "frontal" ||
        roomsWithWalkPaths[index + 1].laneType === "corner"
      ) %
        2))
  );
}

function getLaneName({
  roomsWithWalkPaths,
  index,
  displayIndex,
}: {
  roomsWithWalkPaths: RoomPosition[];
  index: number;
  displayIndex: number;
}): LaneName {
  const laneType: LaneType = roomsWithWalkPaths[index].laneType;
  const laneName = (laneType + displayIndex) as LaneName;

  return laneName;
}

function getDisplayRotation({
  index,
  displayIndex,
  roomsWithWalkPaths,
}: {
  index: number;
  displayIndex: number;
  roomsWithWalkPaths: RoomPosition[];
}): number {
  const cornerRotation = getCornerRotation(
    roomsWithWalkPaths,
    index,
    displayIndex
  );
  const laneRotations = {
    frontal0: -Math.PI / 2,
    frontal1: Math.PI / 2,
    "side-lane0": 0,
    "side-lane1": Math.PI,
    corner0: cornerRotation,
    corner1: cornerRotation,
  };
  const laneName = getLaneName({ index, displayIndex, roomsWithWalkPaths });

  return laneRotations[laneName];
}

function getDisplayPosition({
  index,
  displayIndex,
  roomsWithWalkPaths,
}: {
  index: number;
  displayIndex: number;
  roomsWithWalkPaths: RoomPosition[];
}) {
  const cornerPosition = {
    x: getCornerPosition({
      index,
      axis: "x",
      displayIndex,
      roomsWithWalkPaths,
    }),
    z: getCornerPosition({
      index,
      axis: "z",
      displayIndex,
      roomsWithWalkPaths,
    }),
  };
  const laneName = getLaneName({ index, displayIndex, roomsWithWalkPaths });
  const isFrontal = laneName[0] === "f";
  const lanePosition = {
    [isFrontal ? "x" : "z"]: -Math.sign(displayIndex - 0.5),
  };
  const lanePositions = {
    frontal0: lanePosition,
    frontal1: lanePosition,
    "side-lane0": lanePosition,
    "side-lane1": lanePosition,
    corner0: cornerPosition,
    corner1: cornerPosition,
  };

  return lanePositions[laneName];
}

function cleanLaneTypes(roomsWithWalkPaths: RoomPosition[]): void {
  roomsWithWalkPaths.forEach((roomPosition, index) => {
    if (index > 0 && index < roomsWithWalkPaths.length - 1) {
      if (roomPosition.laneType === "corner") {
        roomPosition.laneType =
          (roomsWithWalkPaths[index - 1].x !== roomPosition.x &&
            roomsWithWalkPaths[index + 1].z !== roomPosition.z) ||
          (roomsWithWalkPaths[index - 1].z !== roomPosition.z &&
            roomsWithWalkPaths[index + 1].x !== roomPosition.x)
            ? "corner"
            : "frontal";
      }
    }
  });
}

function getIntrudedWalkPaths(roomsWithWalkPaths: RoomPosition[]): WalkPath[] {
  cleanLaneTypes(roomsWithWalkPaths);

  return roomsWithWalkPaths.map((roomPosition, index) => {
    const walkPath: WalkPath = { ...roomPosition, displays: [] };

    if (index > 0 && index < roomsWithWalkPaths.length - 1) {
      [0, 1].forEach((displayIndex) => {
        const { x, z } = getDisplayPosition({
          index,
          displayIndex,
          roomsWithWalkPaths,
        });
        const rotation = getDisplayRotation({
          index,
          displayIndex,
          roomsWithWalkPaths,
        });

        walkPath.displays?.push({
          position: {
            x: x ?? 0,
            z: z ?? 0,
          },
          rotation,
        });
      });
    }

    return walkPath;
  });
}

function getPathPositions(
  seed = getRandomSeed(),
  frontalSpace = 2
): WalkPath[] {
  const roomsPaths = getRooms(seed, frontalSpace);
  const roomsWithWalkPaths = getRoomsWithWalkPaths(roomsPaths);
  const pathPositions = getIntrudedWalkPaths(roomsWithWalkPaths);

  return pathPositions;
}

export default getPathPositions;
