// A single small, reused set of royalty-free restaurant photography (Unsplash).
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  heroInterior: u("1517248135467-4c7edcad34c4"),
  diningWarm: u("1414235077428-338989a2e8c0"),
  hotpot: u("1552611052-33e04de081de"),
  table: u("1466978913421-dad2ebd01d17"),
  food1: u("1563245372-f21724e3856d", 1000),
  food2: u("1476224203421-9ac39bcb3327", 1000),
  food3: u("1504674900247-0877df9cc836", 1000),
  drink: u("1558857563-b371033873b8", 1000),
  gallery1: u("1550966871-3ed3cdb5ed0c", 800),
  gallery2: u("1424847651672-bf20a4b0982b", 800),
  gallery3: u("1481931098730-318b6f776db0", 800),
};

export type ImageKey = keyof typeof IMAGES;