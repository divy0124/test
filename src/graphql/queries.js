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
      weeklyPrize
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

export const GET_TOUCHDOWN_BY_DATE_CUSTOM = gql`
  query GetTouchdownByDate($startDate: String!, $endDate: String!) {
    getTouchdownByDate(startDate: $startDate, endDate: $endDate) {
      touchdownId
      startDate
      endDate
      weeklyPrize
      touchDownType
      mathConstant {
        WEEKLY_RESERVE
        SIX_FOR_SEVEN_NUMERATOR
        SIX_FOR_SEVEN_DENOMINATOR
        PRIZE_POOL
        SIX_FOR_SEVEN_RESERVE
      }
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

export const GET_WEEKLY_SUBSCRIBER = gql`
  query GetWeeklySubscribers(
    $startDate: String!
    $endDate: String!
    $search: String
    $page: Int!
    $limit: Int!
  ) {
    getWeeklySubscribers(
      startDate: $startDate
      endDate: $endDate
      search: $search
      page: $page
      limit: $limit
    ) {
      items {
        userName
        fullName
        subScriberDate
        subScribedDays
        entryFee
      }
      meta {
        totalItems
      }
    }
  }
`;

export const GET_TOUCHDOWN_ANALYTICS = gql`
  query GetTouchdownAnalytics(
    $startDate: String!
    $endDate: String!
    $interval: String!
  ) {
    getTouchdownAnalytics(
      startDate: $startDate
      endDate: $endDate
      interval: $interval
    ) {
      interval
      actualEntryCount
      allowedEntryCount
      profit
    }
  }
`;

export const GET_CONTESTS_ANALYTICS = gql`
  query GetContestsAnalytics(
    $startDate: String!
    $endDate: String!
    $isIndividual: Boolean!
    $limit: Int!
  ) {
    getContestsAnalytics(
      startDate: $startDate
      endDate: $endDate
      isIndividual: $isIndividual
      limit: $limit
    ) {
      nbaContestCount
      mlbContestCount
      soccerContestCount
      totalUserEntry
      soccerContests {
        contestId
        totalCount
        startDate
        player1Id
        player2Id
        player1FirstName
        player2FirstName
        player1LastName
        player2LastName
        player1Count
        player2Count
      }
      nbaContests {
        contestId
        totalCount
        startDate
        player1Id
        player2Id
        player1FirstName
        player2FirstName
        player1LastName
        player2LastName
        player1Count
        player2Count
      }
      mlbContests {
        contestId
        totalCount
        startDate
        player1Id
        player2Id
        player1FirstName
        player2FirstName
        player1LastName
        player2LastName
        player1Count
        player2Count
      }
    }
  }
`;
