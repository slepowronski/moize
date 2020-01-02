/* eslint-disable */

import { MicroMemoize } from 'micro-memoize';

export type Fn<Arg extends any = any, Result extends any = any> = (...args: Arg[]) => Result;

export type FunctionalComponent<Props extends object> = Fn<Props> & {
  displayName?: string;
};

export type Key = any[];
export type Value = any;

export type Cache = MicroMemoize.Cache;

export type Expiration = {
  expirationMethod: Function;
  key: Key;
  timeoutId: number;
};

export type OnCacheOperation = (cache: Cache, options: Options, moized: Function) => void;

export type IsEqual = <KeyArg>(cacheKeyArg: KeyArg, keyArg: KeyArg) => boolean;
export type IsMatchingKey = (cacheKey: Key, key: Key) => boolean;
export type TransformKey = (key: Key) => Key;

export type MicroMemoizeOptions = MicroMemoize.Options;

export type Options = Partial<{
  equals: IsEqual;
  isDeepEqual: boolean;
  isPromise: boolean;
  isReact: boolean;
  isSerialized: boolean;
  isShallowEqual: boolean;
  matchesKey: IsMatchingKey;
  maxAge: number;
  maxArgs: number;
  maxSize: number;
  onCacheAdd: OnCacheOperation;
  onCacheChange: OnCacheOperation;
  onCacheHit: OnCacheOperation;
  onExpire: (key: Key) => any;
  profileName: string;
  serializer: (key: Key) => Key;
  shouldSerializeFunctions: boolean;
  transformArgs: (key: Key) => Key;
  updateExpire: boolean;
}>;

export type StatsProfile = {
  calls: number;
  hits: number;
};

export type StatsObject = {
  calls: number;
  hits: number;
  usage: string;
};

export type GlobalStatsObject = StatsObject & {
  profiles?: Record<string, StatsProfile>;
};

export type StatsCache = {
  anonymousProfileNameCounter: number;
  isCollectingStats: boolean;
  profiles: Record<string, StatsProfile>;
};

export type Moizeable = Fn & Record<string, any>;

export type Memoized<OriginalFn extends Moizeable> = MicroMemoize.Memoized<OriginalFn>;

export type Moized<
  OriginalFn extends Moizeable = Moizeable,
  CombinedOptions extends Options = Options
> = Memoized<OriginalFn> & {
  // values
  _microMemoizeOptions: Pick<
    CombinedOptions,
    'isPromise' | 'maxSize' | 'onCacheAdd' | 'onCacheChange' | 'onCacheHit'
  > & {
    isEqual: CombinedOptions['equals'];
    isMatchingKey: CombinedOptions['matchesKey'];
    transformKey: CombinedOptions['transformArgs'];
  };
  cache: Cache;
  cacheSnapshot: Cache;
  expirations: Expiration[];
  expirationsSnapshot: Expiration[];
  options: CombinedOptions;
  originalFunction: OriginalFn;

  // react-specific values
  contextTypes?: Record<string, Function>;
  defaultProps?: Record<string, any>;
  displayName?: string;
  propTypes: Record<string, Function>;

  // methods
  clear: () => void;
  clearStats: () => void;
  get: (key: Key) => any;
  getStats: () => StatsProfile;
  has: (key: Key) => boolean;
  isCollectingStats: () => boolean;
  isMoized: () => true;
  keys: () => Cache['keys'];
  remove: (key: Key) => void;
  set: (key: Key, value: any) => void;
  values: () => Cache['values'];
};

export type MoizeConfiguration<OriginalFn extends Moizeable> = {
  expirations: Expiration[];
  options: Options;
  originalFunction: OriginalFn;
};

export type CurriedMoize<OriginalOptions> = <
  CurriedFn extends Moizeable,
  CurriedOptions extends Options
>(
  curriedFn: CurriedFn | CurriedOptions,
  curriedOptions?: CurriedOptions
) =>
  | Moized<CurriedFn, OriginalOptions & CurriedOptions>
  | CurriedMoize<OriginalOptions & CurriedOptions>;

export interface Moize<DefaultOptions extends Options = Options> extends Moizeable {
  <Fn extends Moizeable, PassedOptions extends Options>(fn: Fn, options?: PassedOptions): Moized<
    Fn,
    Options & DefaultOptions & PassedOptions
  >;
  <Fn extends Moized<Moizeable>, PassedOptions extends Options>(
    fn: Fn,
    options?: PassedOptions
  ): Moized<Fn['fn'], Options & DefaultOptions & PassedOptions>;
  <PassedOptions extends Options>(options: PassedOptions): Moize<PassedOptions>;

  clearStats: (profileName?: string) => void;
  collectStats: () => void;
  compose: (...moizers: Moize[]) => Moize;
  deep: Moize<{ isDeepEqual: true }>;
  getStats: (profileName?: string) => StatsObject;
  infinite: Moize;
  isCollectingStats: () => boolean;
  isMoized: (value: any) => value is Moized;
  maxAge: (age: number) => Moize;
  maxArgs: (args: number) => Moize;
  maxSize: (size: number) => Moize;
  promise: Moize<{ isPromise: true }>;
  react: Moize<{ isReact: true }>;
  serialize: Moize<{ isSerialized: true }>;
  shallow: Moize<{ isShallowEqual: true }>;
}