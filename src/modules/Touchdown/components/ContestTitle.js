import { InfoCircleOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Form, Input, message, Row, Col, Button } from 'antd';
import { useEffect } from 'react';

import { CREATE_OR_UPDATE_QUESTIONS } from 'graphql/mutations';
import { GET_SPORTS_QUESTIONS } from 'graphql/queries';

import mlbSportLogo from '../../../assets/images/sports-logo/mlb.svg';
import nbaSportLogo from '../../../assets/images/sports-logo/nba.svg';
import soccerSportLogo from '../../../assets/images/sports-logo/soccer.svg';

import '../../../assets/styles/contest-title.less';

export default function ContestTitle() {
  const [form] = Form.useForm();
  const [getQuestions] = useLazyQuery(GET_SPORTS_QUESTIONS);
  const [createOrUpdateQuestions] = useMutation(CREATE_OR_UPDATE_QUESTIONS);

  const sportName = (key) => {
    switch (key) {
      case 'POINTS':
        return 'NBA';

      case 'SHOTS':
      case 'GOAL_KEEPER_SAVES':
      case 'PASSES_COMPLETED':
        return 'Soccer';

      case 'TOTAL_BASES':
      case 'STRIKEOUTS':
        return 'MLB';

      default:
        return '';
    }
  };
  const onFinish = async (values) => {
    const questions = Object.keys(values).map((key) => ({
      sportName: sportName(key),
      statName: key,
      question: values[key],
    }));

    createOrUpdateQuestions({ variables: { updateTitles: questions } })
      .then(() => {
        message.success('Title updated successfully !');
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };

  function getLabel(image, sportName) {
    return (
      <div className="sport">
        <img alt="Loading..." className="sport-image" src={image} />
        <span className="sport-name">{sportName}</span>
      </div>
    );
  }
  useEffect(() => {
    getQuestions().then(({ data }) => {
      const titles = {};
      const { getAllSportsQuestion } = data;
      getAllSportsQuestion?.forEach((title) => {
        const { statName, question } = title;
        titles[statName] = question;
      });
      form.setFieldsValue(titles);
    });
  }, [form]);

  return (
    <div className="contest-title">
      <Form
        form={form}
        name="sport-title"
        onFinish={onFinish}
        requiredMark={false}
        style={{ maxWidth: 500 }}
      >
        <Row className="sport-item single-input">
          <Col span={3}>{getLabel(nbaSportLogo, 'NBA')}</Col>
          <Col span={11}>
            <Form.Item
              name="POINTS"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row className="sport-item font-calluna">
          <Col span={3} style={{ marginTop: '27px' }}>
            {getLabel(mlbSportLogo, 'MLB')}
          </Col>
          <Col span={11}>
            <Form.Item
              label="Pitchers"
              name="TOTAL_BASES"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Hitters"
              name="STRIKEOUTS"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row className="sport-item">
          <Col span={3} style={{ marginTop: '27px' }}>
            {getLabel(soccerSportLogo, 'Soccer')}
          </Col>
          <Col span={11}>
            <Form.Item
              label="GoalKeeper"
              name="GOAL_KEEPER_SAVES"
              rules={[{ required: true, message: 'Title is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="FieldPlayer"
              name="PASSES_COMPLETED"
              rules={[{ required: true, message: 'Title is required' }]}
              tooltip={{
                title: 'Passes Completed',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input name="Soccer" />
            </Form.Item>
            <Form.Item
              label="FieldPlayer"
              name="SHOTS"
              rules={[{ required: true, message: 'Title is required' }]}
              tooltip={{
                title: 'Shots',
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
