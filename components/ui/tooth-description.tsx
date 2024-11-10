export const getToothDescription = (location: number): string => {
  const toothMap: Record<number, string> = {
    // Upper Right (1st Quadrant)
    11: "permanent upper right central incisor",
    12: "permanent upper right lateral incisor",
    13: "permanent upper right canine",
    14: "permanent upper right first premolar",
    15: "permanent upper right second premolar",
    16: "permanent upper right first molar",
    17: "permanent upper right second molar",
    18: "permanent upper right third molar",
    // Upper Left (2nd Quadrant)
    21: "permanent upper left central incisor",
    22: "permanent upper left lateral incisor",
    23: "permanent upper left canine",
    24: "permanent upper left first premolar",
    25: "permanent upper left second premolar",
    26: "permanent upper left first molar",
    27: "permanent upper left second molar",
    28: "permanent upper left third molar",
    // Lower Left (3rd Quadrant)
    31: "permanent lower left central incisor",
    32: "permanent lower left lateral incisor",
    33: "permanent lower left canine",
    34: "permanent lower left first premolar",
    35: "permanent lower left second premolar",
    36: "permanent lower left first molar",
    37: "permanent lower left second molar",
    38: "permanent lower left third molar",
    // Lower Right (4th Quadrant)
    41: "permanent lower right central incisor",
    42: "permanent lower right lateral incisor",
    43: "permanent lower right canine",
    44: "permanent lower right first premolar",
    45: "permanent lower right second premolar",
    46: "permanent lower right first molar",
    47: "permanent lower right second molar",
    48: "permanent lower right third molar",
  };

  return toothMap[location] || "unknown tooth";
};
