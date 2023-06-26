import { Button, Form, Input } from 'antd';

import mlb from '../../../assets/images/sports-logo/mlb.svg';
import nba from '../../../assets/images/sports-logo/nba.svg';
import soccer from '../../../assets/images/sports-logo/soccer.svg';
import '../../../assets/styles/contest-title.less';

export default function ContestTitle() {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
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
  return (
    <div className="contest-title">
      <Form
        form={form}
        name="sport-title"
        onFinish={onFinish}
        style={{ maxWidth: 500 }}
      >
        <Form.Item
          className="title"
          label={getLabel(nba, 'NBA')}
          name="nba"
          rules={[{ required: false }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className="player-title"
          label={getLabel(mlb, 'MLB')}
          name="mlb"
          rules={[{ required: false }]}
        >
          <div className="players-type">
            <div className="pitcher">
              <pre>Pitchers :</pre>
              <Input />
            </div>
            <div className="hitter">
              <pre>Hitters :</pre>
              <Input />
            </div>
          </div>
        </Form.Item>

        <Form.Item
          className="player-title"
          label={getLabel(soccer, 'SOCCER')}
          name="mlb"
          rules={[{ required: false }]}
        >
          <div className="players-type">
            <div className="gk">
              <pre>GoalKeeper :</pre>
              <Input />
            </div>
            <div className="fp">
              <pre>FieldPlayer :</pre>
              <Input />
            </div>
            <div className="fp">
              <pre>FieldPlayer :</pre>
              <Input />
            </div>
          </div>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button className="save" htmlType="submit" type="primary">
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
