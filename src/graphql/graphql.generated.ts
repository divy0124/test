/* eslint-disable */
import { useQuery, UseQueryOptions } from 'react-query';
import useFetchData from './fetcher.ts';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type DailyLeaderBoardObjectType = {
  entryId: Scalars['Int']['output'];
  entryNumber: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  payout: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  winAmount: Scalars['Float']['output'];
};

export type LeaderBoardObjectType = {
  name: Scalars['String']['output'];
  payout: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  winAmount: Scalars['Float']['output'];
};

export type Mutation = {
  createOrUpdateMathConstant: Array<UpdatableMathConstantObjectType>;
  createOrUpdateSportsQuestions: Array<UpdatableSportsQuestionsObjectType>;
};

export type MutationCreateOrUpdateMathConstantArgs = {
  mathConstant: Array<UpdatableMathConstantInputType>;
};

export type MutationCreateOrUpdateSportsQuestionsArgs = {
  updateTitles: Array<UpdatableSportsQuestionsInputType>;
};

export type PaginatedDailyLeaderBoardObjectType = {
  data: Array<DailyLeaderBoardObjectType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PaginatedLeaderBoardObjectType = {
  data: Array<LeaderBoardObjectType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type PrizePoolObjectType = {
  actualJackpotAmount?: Maybe<Scalars['Float']['output']>;
  actualReserveAmountStr: Scalars['String']['output'];
  actualTopPropFees?: Maybe<Scalars['Float']['output']>;
  actualWeeklyReserveAmount?: Maybe<Scalars['Float']['output']>;
  endDate: Scalars['String']['output'];
  entryFees: Scalars['Int']['output'];
  jackpotWinnersCount: Scalars['Int']['output'];
  maxEntriesPerUser: Scalars['Int']['output'];
  mlbContestsCount: Scalars['Int']['output'];
  nbaContestsCount: Scalars['Int']['output'];
  nflContestsCount: Scalars['Int']['output'];
  pgaContestsCount: Scalars['Int']['output'];
  predetermineJackpot: Scalars['Float']['output'];
  predetermineReserveAmountStr: Scalars['String']['output'];
  prizePoolId: Scalars['ID']['output'];
  sixForSevenWinnersCount: Scalars['Int']['output'];
  soccerContestsCount: Scalars['Int']['output'];
  startDate: Scalars['String']['output'];
  status: PrizePoolStatus;
  supportedSports: Array<SupportedSports>;
  totalEntrants: Scalars['Int']['output'];
  userEntryCount: Scalars['Int']['output'];
};

export enum PrizePoolStatus {
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Live = 'LIVE',
  Pending = 'PENDING',
}

export type Query = {
  abc: Scalars['String']['output'];
  getAllSportsQuestion: Array<UpdatableSportsQuestionsObjectType>;
  getDailyLeaderBoard: PaginatedDailyLeaderBoardObjectType;
  getMathConstant: Array<UpdatableMathConstantObjectType>;
  getTouchdownByDate: Array<TouchdownObjectType>;
  getWeeklyHistoryByDateRange: Array<WeeklyHistoryObjectType>;
  getWeeklyLeaderBoard: PaginatedLeaderBoardObjectType;
  getWeeklySubscribers: Array<WeeklySubscriberObjectType>;
};

export type QueryGetDailyLeaderBoardArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  prevRank: Scalars['Int']['input'];
  prevScore: Scalars['Int']['input'];
  prizePoolId: Scalars['Int']['input'];
  searchStr: Scalars['String']['input'];
};

export type QueryGetTouchdownByDateArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QueryGetWeeklyHistoryByDateRangeArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QueryGetWeeklyLeaderBoardArgs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  prevRank: Scalars['Int']['input'];
  prevScore: Scalars['Int']['input'];
  searchStr?: Scalars['String']['input'];
  touchdownId: Scalars['Int']['input'];
};

export type QueryGetWeeklySubscribersArgs = {
  endDate: Scalars['String']['input'];
  search: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export enum SportsStatName {
  GoalKeeperSaves = 'GOAL_KEEPER_SAVES',
  PassesCompleted = 'PASSES_COMPLETED',
  Points = 'POINTS',
  Shots = 'SHOTS',
  Strikeouts = 'STRIKEOUTS',
  TotalBases = 'TOTAL_BASES',
}

export enum SupportedSports {
  Mlb = 'MLB',
  Nba = 'NBA',
  Nfl = 'NFL',
  Pga = 'PGA',
  Soccer = 'Soccer',
}

export enum TouchdownMathConstant {
  PrizePool = 'PRIZE_POOL',
  SixForSevenDenominator = 'SIX_FOR_SEVEN_DENOMINATOR',
  SixForSevenNumerator = 'SIX_FOR_SEVEN_NUMERATOR',
  SixForSevenReserve = 'SIX_FOR_SEVEN_RESERVE',
  ToppropProfit = 'TOPPROP_PROFIT',
  WeeklyReserve = 'WEEKLY_RESERVE',
}

export type TouchdownObjectType = {
  endDate?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isOpen: Scalars['Boolean']['output'];
  predetermineWeeklyPrize: Scalars['Float']['output'];
  prizePools?: Maybe<Array<PrizePoolObjectType>>;
  startDate?: Maybe<Scalars['String']['output']>;
  touchDownType: TouchdownType;
  touchdownId: Scalars['ID']['output'];
};

export enum TouchdownType {
  SevenForSeven = 'SEVEN_FOR_SEVEN',
}

export type UpdatableMathConstantInputType = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: TouchdownMathConstant;
  value: Scalars['Float']['input'];
};

export type UpdatableMathConstantObjectType = {
  id?: Maybe<Scalars['Int']['output']>;
  name: TouchdownMathConstant;
  value: Scalars['Float']['output'];
};

export type UpdatableSportsQuestionsInputType = {
  question: Scalars['String']['input'];
  sportName: SupportedSports;
  statName: SportsStatName;
};

export type UpdatableSportsQuestionsObjectType = {
  question: Scalars['String']['output'];
  sportName: SupportedSports;
  statName: SportsStatName;
};

export type WeeklyHistoryObjectType = {
  DateRange: Scalars['String']['output'];
  entryFee: Scalars['Int']['output'];
  profit: Scalars['Float']['output'];
  totalEntryFees: Scalars['Int']['output'];
  totalSubscribers: Scalars['Int']['output'];
  totalTopropVig: Scalars['Float']['output'];
  totalUserEntry: Scalars['Int']['output'];
  totalWeeklyReserve: Scalars['Float']['output'];
  weeklyPrize: Scalars['Int']['output'];
};

export type WeeklySubscriberObjectType = {
  amount: Scalars['Int']['output'];
  fullName: Scalars['String']['output'];
  subScribedDays: Scalars['Int']['output'];
  subScriberDate: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type GetDailyLeaderBoardQueryVariables = Exact<{
  prizePoolId: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  prevRank: Scalars['Int']['input'];
  prevScore: Scalars['Int']['input'];
  searchStr: Scalars['String']['input'];
}>;

export type GetDailyLeaderBoardQuery = {
  getDailyLeaderBoard: {
    page: number;
    limit: number;
    totalCount: number;
    data: Array<{
      rank: number;
      winAmount: number;
      name: string;
      score: number;
      status: string;
      payout: string;
      entryId: number;
      entryNumber: number;
    }>;
  };
};

export type GetMathConstantQueryVariables = Exact<{ [key: string]: never }>;

export type GetMathConstantQuery = {
  getMathConstant: Array<{
    id?: number | null;
    name: TouchdownMathConstant;
    value: number;
  }>;
};

export type GetTouchdownByDateQueryVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
}>;

export type GetTouchdownByDateQuery = {
  getTouchdownByDate: Array<{
    touchdownId: string;
    startDate?: string | null;
    endDate?: string | null;
    predetermineWeeklyPrize: number;
    isActive: boolean;
    isOpen: boolean;
    touchDownType: TouchdownType;
    prizePools?: Array<{
      prizePoolId: string;
      entryFees: number;
      totalEntrants: number;
      supportedSports: Array<SupportedSports>;
      maxEntriesPerUser: number;
      predetermineReserveAmountStr: string;
      predetermineJackpot: number;
      actualJackpotAmount?: number | null;
      actualWeeklyReserveAmount?: number | null;
      startDate: string;
      endDate: string;
      actualTopPropFees?: number | null;
      status: PrizePoolStatus;
      userEntryCount: number;
      jackpotWinnersCount: number;
      sixForSevenWinnersCount: number;
      nbaContestsCount: number;
      mlbContestsCount: number;
      pgaContestsCount: number;
      nflContestsCount: number;
      soccerContestsCount: number;
      actualReserveAmountStr: string;
    }> | null;
  }>;
};

export const GetDailyLeaderBoardDocument = `
    query GetDailyLeaderBoard($prizePoolId: Int!, $limit: Int!, $page: Int!, $prevRank: Int!, $prevScore: Int!, $searchStr: String!) {
  getDailyLeaderBoard(
    prizePoolId: $prizePoolId
    limit: $limit
    page: $page
    prevRank: $prevRank
    prevScore: $prevScore
    searchStr: $searchStr
  ) {
    page
    limit
    totalCount
    data {
      rank
      winAmount
      name
      score
      status
      payout
      entryId
      entryNumber
    }
  }
}
    `;
export const useGetDailyLeaderBoardQuery = <
  TData = GetDailyLeaderBoardQuery,
  TError = unknown,
>(
  variables: GetDailyLeaderBoardQueryVariables,
  options?: UseQueryOptions<GetDailyLeaderBoardQuery, TError, TData>,
) =>
  useQuery<GetDailyLeaderBoardQuery, TError, TData>(
    ['GetDailyLeaderBoard', variables],
    useFetchData<GetDailyLeaderBoardQuery, GetDailyLeaderBoardQueryVariables>(
      GetDailyLeaderBoardDocument,
    ).bind(null, variables),
    options,
  );
export const GetMathConstantDocument = `
    query GetMathConstant {
  getMathConstant {
    id
    name
    value
  }
}
    `;
export const useGetMathConstantQuery = <
  TData = GetMathConstantQuery,
  TError = unknown,
>(
  variables?: GetMathConstantQueryVariables,
  options?: UseQueryOptions<GetMathConstantQuery, TError, TData>,
) =>
  useQuery<GetMathConstantQuery, TError, TData>(
    variables === undefined
      ? ['GetMathConstant']
      : ['GetMathConstant', variables],
    useFetchData<GetMathConstantQuery, GetMathConstantQueryVariables>(
      GetMathConstantDocument,
    ).bind(null, variables),
    options,
  );
export const GetTouchdownByDateDocument = `
    query GetTouchdownByDate($startDate: String!, $endDate: String!) {
  getTouchdownByDate(startDate: $startDate, endDate: $endDate) {
    touchdownId
    startDate
    endDate
    predetermineWeeklyPrize
    isActive
    isOpen
    touchDownType
    prizePools {
      prizePoolId
      entryFees
      totalEntrants
      supportedSports
      maxEntriesPerUser
      predetermineReserveAmountStr
      predetermineJackpot
      actualJackpotAmount
      actualWeeklyReserveAmount
      startDate
      endDate
      actualTopPropFees
      status
      userEntryCount
      jackpotWinnersCount
      sixForSevenWinnersCount
      nbaContestsCount
      mlbContestsCount
      pgaContestsCount
      nflContestsCount
      soccerContestsCount
      actualReserveAmountStr
    }
  }
}
    `;
export const useGetTouchdownByDateQuery = <
  TData = GetTouchdownByDateQuery,
  TError = unknown,
>(
  variables: GetTouchdownByDateQueryVariables,
  options?: UseQueryOptions<GetTouchdownByDateQuery, TError, TData>,
) =>
  useQuery<GetTouchdownByDateQuery, TError, TData>(
    ['GetTouchdownByDate', variables],
    useFetchData<GetTouchdownByDateQuery, GetTouchdownByDateQueryVariables>(
      GetTouchdownByDateDocument,
    ).bind(null, variables),
    options,
  );
