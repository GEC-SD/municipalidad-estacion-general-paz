import { Status } from './global';

export type SiteSetting = {
  id: string;
  key: string;
  value: any;
  description?: string;
  updated_at: string;
};

export type MunicipalityInfo = {
  historia?: string;
  mision?: string;
  vision?: string;
  valores?: string[];
};

export type SettingsSlice = {
  municipalityInfo: MunicipalityInfo | null;
  settings: SiteSetting[];
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
