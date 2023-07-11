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
