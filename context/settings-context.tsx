import { Settings } from "@/types/models";
import { createContext, useContext } from "react";
import { useAsyncStorageState } from "../hooks/use-async-storage-state";


type SettingsContextType = {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setStartDate: (isostring: string) => void;
  setPeriodLength: (periodLength: Settings["periodLength"]) => void;
  setAnalyseIncomeInstead: (analyseIncomeInstead: Settings["analyseIncomeInstead"]) => void;
  setSpreadIrregularTransactions: (spreadIrregularTransactions: Settings["spreadIrregularTransactions"]) => void;
  setDefaultCurrency: (defaultCurrency: Settings["defaultCurrency"]) => void;
  settingsHydrated: boolean;
};



const SettingsContext = createContext<SettingsContextType | null>(null);

import default_settings from '@/data/default_settings.json';
const DEFAULT_SETTINGS : Settings = default_settings.settings as Settings; // as Settings is necessary to assert that periodLength is of the correct type
const settingsKey = "settings";

export function SettingsProvider({ children } : {children : React.ReactNode}) {
  const [settings, setSettings, settingsHydrated] =
    useAsyncStorageState<Settings>(settingsKey, DEFAULT_SETTINGS);

  const setStartDate = (isostring : string) => {
    setSettings(prev => ({...prev, startDate: isostring}));
  };

  const setPeriodLength = (periodLength: Settings["periodLength"]) => {
    setSettings(prev => ({...prev, periodLength: periodLength}));
  };

  const setAnalyseIncomeInstead = (analyseIncomeInstead: Settings["analyseIncomeInstead"]) => {
    setSettings(prev => ({...prev, analyseIncomeInstead: analyseIncomeInstead}));
  };

  const setSpreadIrregularTransactions = (spreadIrregularTransactions: Settings["spreadIrregularTransactions"]) => {
    setSettings(prev => ({...prev, spreadIrregularTransactions: spreadIrregularTransactions}));
  };

  const setDefaultCurrency = (defaultCurrency: Settings["defaultCurrency"]) => {
    setSettings(prev => ({...prev, defaultCurrency: defaultCurrency}));
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, setStartDate, setPeriodLength, setAnalyseIncomeInstead, setSpreadIrregularTransactions, setDefaultCurrency, settingsHydrated }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be inside <SettingsProvider>");
  return ctx;
}