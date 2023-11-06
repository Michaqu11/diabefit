export interface IAllData {
  libreAPI: string;
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
