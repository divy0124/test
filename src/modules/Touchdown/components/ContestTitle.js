import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';

import mlb from '../../../assets/images/sports-logo/mlb.svg';
import nba from '../../../assets/images/sports-logo/nba.svg';
import soccer from '../../../assets/images/sports-logo/soccer.svg';

import '../../../assets/styles/contest-title.less';

export default function ContestTitle() {
  const [form] = Form.useForm();

  const sportName = (key) => {
    if (key === 'POINTS') {
      return 'NBA';
    }
    if (
      key === 'SHOTS' ||
      key === 'GOAL_KEEPER_SAVES' ||
      key === 'PASSES_COMPLETED'
    ) {
      return 'Soccer';
    }
    if (key === 'TOTAL_BASES' || key === 'STRIKEOUTS') {
      return 'MLB';
    }
    return '';
  };
  const onFinish = async (values) => {
    const inputData = Object.keys(values).map((key) => ({
      sportName: sportName(key),
      statName: key,
      question: values[key],
    }));
    const response = await axios
      .post(
        'http://localhost:5008/api/admin/touchdown/sport/question',
        inputData,
      )
      .catch((error) => {
        message.error(error?.message);
      });
    if (response.status === 201) {
      message.success('Title updated successfully !');
    }
  };

  function getLabel(image, sportName) {
    return (
      <div className="sport">
        <img alt="Loading..." className="sport-image" src={image} />
        <span className="sport-name">{sportName}</span>
      </div>
    );
  }

  const tailLayout = {
    wrapperCol: { offset: 0, span: 16 },
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        'http://localhost:5008/api/admin/touchdown/sport/question',
      );

      const titles = {};
      response.data?.forEach((title) => {
        const { statName, question } = title;
        titles[statName] = question;
      });
      form.setFieldsValue(titles);
    }

    fetchData();
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
        <div className="nba">
          <div className="nba-container">
            <div className="nba-logo">{getLabel(nba, 'NBA')}</div>

            <div className="nba-player">
              <Form.Item
                name="POINTS"
                rules={[{ required: true, message: 'Title is required' }]}
              >
                <Input />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="mlb">
          <div className="container">
            <div className="mlb-logo">{getLabel(mlb, 'MLB')}</div>
            <div className="players-type">
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
            </div>
          </div>
        </div>

        <div className="soccer">
          <div className="container">
            <div className="soccer-logo">{getLabel(soccer, 'SOCCER')}</div>
            <div className="player-type">
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
            </div>
          </div>
        </div>

        <div className="save">
          <Form.Item {...tailLayout}>
            <Button htmlType="submit" type="primary">
              SAVE
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
