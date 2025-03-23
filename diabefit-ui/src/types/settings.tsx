export type LibreData = {
  email: string;
  password: string;
  token?: string;
  userId?: string;
};
export interface IAllData {
  libreAPI: LibreData;
  model: string;
  settings: {
    diabetesType: number;
    insulin: {
      actingTime: string;
      offsetTime: string;
    };
    insulinCorrection: number;
    targetRange: {
      from: number;
      to: number;
    };
    units: number[];
  };
}

export interface ISettings {
  diabetesType: number;
  insulin: {
    actingTime: string;
    offsetTime: string;
  };
  insulinCorrection: number;
  targetRange: {
    from: number;
    to: number;
  };
  units: number[];
}
