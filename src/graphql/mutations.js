import { gql } from '@apollo/client';

export const CREATE_OR_UPDATE_QUESTIONS = gql`
  mutation CreateOrUpdateSportsQuestions(
    $updateTitles: [UpdatableSportsQuestionsInputType!]!
  ) {
    createOrUpdateSportsQuestions(updateTitles: $updateTitles) {
      sportName
      statName
      question
    }
  }
`;

export const CREATE_OR_UPDATE_MATH_CONSTANT = gql`
  mutation CreateOrUpdateMathConstant(
    $mathConstant: [UpdatableMathConstantInputType!]!
  ) {
    createOrUpdateMathConstant(mathConstant: $mathConstant) {
      id
      name
      value
    }
  }
`;

export const CREATE_TOUCHDOWN = gql`
  mutation CreateTouchdown($data: CreateTouchdownInputType!) {
    createTouchdown(data: $data) {
      touchdownId
      startDate
      endDate
      touchDownType
      mathConstant {
        WEEKLY_RESERVE
        SIX_FOR_SEVEN_NUMERATOR
        SIX_FOR_SEVEN_DENOMINATOR
        PRIZE_POOL
        SIX_FOR_SEVEN_RESERVE
      }
      prizePool {
        prizePoolId
        entryFees
        totalEntrants
        supportedSports
        maxEntriesPerUser
        predetermineJackpot
        predetermineWeeklyReserveAmount
        predeterminePrizePool
        startDate
        endDate
        predetermineTopPropFees
        isTouchdownRollsOver
        status
        predetermineReserveAmount {
          SIX_FOR_SEVEN
        }
      }
    }
  }
`;

export const UPDATE_TOUCHDOWN = gql`
  mutation CreateTouchdown(
    $data: UpdateTouchdownInputType!
    $touchdownId: number!
  ) {
    updateTouchdown(data: $data, touchdownId: $touchdownId) {
      touchdownId
      startDate
      endDate
      touchDownType
    }
  }
`;

export const CREATE_PRIZE_POOL = gql`
  mutation CreatePrizePool($data: CreatePrizePoolInputType!) {
    createPrizePool(data: $data) {
      prizePoolId
      entryFees
      totalEntrants
      supportedSports
      maxEntriesPerUser
      predetermineJackpot
      predetermineWeeklyReserveAmount
      predeterminePrizePool
      startDate
      endDate
      predetermineTopPropFees
      status
      predetermineReserveAmount {
        SIX_FOR_SEVEN
      }
    }
  }
`;

export const UPDATE_PRIZE_POOL = gql`
  mutation UpdatePrizePool(
    $data: CreatePrizePoolInputType!
    $prizePoolId: Float!
  ) {
    updatePrizePool(data: $data, prizePoolId: $prizePoolId) {
      prizePoolId
      startDate
      endDate
      entryFees
      totalEntrants
      supportedSports
      maxEntriesPerUser
      predetermineJackpot
      predetermineWeeklyReserveAmount
      predeterminePrizePool
      prizeDate
      predetermineTopPropFees
      status
      predetermineReserveAmount {
        SIX_FOR_SEVEN
      }
    }
  }
`;
