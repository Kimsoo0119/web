export enum AuthErrorEnums {
  NO_AUTH_TOKEN = "NoAuthToken",
  INVALID_TOKEN = "InvalidToken",
  JWT_EXPIRED = "JwtExpired",
  UNAUTHORIZED = "Unauthorized",
}

export interface IFacilityFeature {
  key: string;
  label: string;
  icon: JSX.Element;
  exclusiveWith?: string;
}

export const ColorPalette = {
  White: "#fff",
  Black: "#000",
  DarkGray: "#666",
  Gray: "#ddd",
  LightGray: "#f0f0f0",
  BrandColor: "#fb6107",
  BrandColorHover: "#febe98",
};
