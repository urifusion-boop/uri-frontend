import { TFeatureLimit } from '@/models/dtos/FeatureLimitDto';

export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

export const containsNumber = (value: string) => {
  const regex = /\d/;
  return regex.test(value);
};

export const containsSymbol = (value: string) => {
  const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return regex.test(value);
};

export const containsSymbolAndNumber = (value: string) => {
  const hasNumber = /\d/.test(value);
  const hasSymbol = /[^a-zA-Z0-9]/.test(value);

  return hasNumber && hasSymbol;
};

export const containsLowercaseAndUppercase = (value: string) => {
  const regex = /(?=.*[a-z])(?=.*[A-Z])/;

  return regex.test(value);
};

export const isFeatureDisabled = (featureLimit: TFeatureLimit, featureName: string, accountName?: string) => {
  if (!featureLimit) {
    return false;
  }
  if (featureName === 'accountTracking') {
    if (!featureLimit.accountTracking.locked && featureLimit.accountTracking.accounts.limit === 0) {
      return false;
    }
    if (accountName) {
      const account = featureLimit.accountTracking[accountName as keyof Omit<TFeatureLimit['accountTracking'], 'locked'>];
      if (account) {
        return !!account.locked || (account.count >= account.limit && account.limit !== 0);
      }
    }
    return !!featureLimit.accountTracking.locked || featureLimit.accountTracking.accounts.locked || featureLimit.accountTracking.accounts.count >= featureLimit.accountTracking.accounts.limit;
  } else if (featureName in featureLimit) {
    const feature = featureLimit[featureName as keyof Omit<TFeatureLimit, 'accountTracking'>];

    return !!feature.locked || (feature.count >= feature.limit && feature.limit !== 0);
  }
  return false;
};

export const isFeatureUnlimited = (limit: number) => {
  return limit <= 0;
};
