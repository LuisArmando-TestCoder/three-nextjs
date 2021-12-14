import { selector } from "recoil";

const iconNames = ["magnifying-glass", "back", "settings"] as const;

export default selector({
  key: "Icons",
  get: async () => {
    const SVGGroup: { [iconNames: string]: string } = {};
    const SVGResponses = await Promise.all(
      iconNames.map((iconName) => {
        return (async () => {
          const response = await fetch(`../../icons/${iconName}.svg`);
          const SVG = await response.text();

          return { iconName, SVG };
        })();
      })
    );

    SVGResponses.forEach(({ iconName, SVG }) => {
      SVGGroup[iconName] = SVG;
    });

    return SVGGroup;
  },
});
