import { gql } from '@apollo/client';

export const GET_MATH_CONSTANT = gql`
  query GetMathConstant {
    getMathConstant {
      id
      name
      value
    }
  }
`;

export const GET_SPORTS_QUESTIONS = gql`
  query GetAllSportsQuestion {
    getAllSportsQuestion {
      sportName
      statName
      question
    }
  }
`;

export const GET_TOUCHDOWN_BY_DATE = gql`
  query GetTouchdownByDate($startDate: String!, $endDate: String!) {
    getTouchdownByDate(startDate: $startDate, endDate: $endDate) {
      touchdownId
      startDate
      endDate
      predetermineWeeklyPrize
      touchDownType
      prizePools {
        prizePoolId
        entryFees
        totalEntrants
        supportedSports
        maxEntriesPerUser
        predetermineReserveAmountStr
        actualReserveAmountStr
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
        rollsOver
        topPropVig
        prizePool
        profit
        addedByTopProp
      }
    }
  }
`;

export const GET_DAILY_LEADER_BOARD = gql`
  query GetDailyLeaderBoard(
    $prizePoolId: Int!
    $limit: Int!
    $page: Int!
    $prevRank: Int!
    $prevScore: Int!
    $searchStr: String!
  ) {
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

export const GET_WEEKLY_LEADER_BOARD = gql`
  query GetWeeklyLeaderBoard(
    $touchdownId: Int!
    $limit: Int!
    $page: Int!
    $prevRank: Int!
    $prevScore: Int!
    $searchStr: String!
  ) {
    getWeeklyLeaderBoard(
      touchdownId: $touchdownId
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
      }
    }
  }
`;

//= =====> Create Touchdown Queries <====== //

export const GET_TOUCHDOWN_BY_DATE_CUSTOM = gql`
  query GetTouchdownByDate($startDate: String!, $endDate: String!) {
    getTouchdownByDate(startDate: $startDate, endDate: $endDate) {
      touchdownId
      startDate
      endDate
      predetermineWeeklyPrize
      touchDownType
      prizePools {
        prizePoolId
        entryFees
        totalEntrants
        supportedSports
        maxEntriesPerUser
        actualReserveAmount {
          SIX_FOR_SEVEN
        }
        predetermineReserveAmount {
          SIX_FOR_SEVEN
        }
        predetermineJackpot
        actualJackpotAmount
        actualWeeklyReserveAmount
        startDate
        endDate
        actualTopPropFees
        status
        topPropVig
        prizePool
        predetermineWeeklyReserveAmount
        predeterminePrizePool
        predetermineTopPropFees
        userEntryCount
      }
    }
  }
`;
