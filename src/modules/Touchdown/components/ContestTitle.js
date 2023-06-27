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
        <div className="nba">
          <div className="nba-container">
            <div className="nba-logo">{getLabel(nba, 'NBA')}</div>

            <div className="nba-player">
              <Form.Item name="nba" rules={[{ required: false }]}>
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
                name="mlbPitcher"
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <div className="pitcher">
                  <div className="text">
                    <span>Pitchers &#58;</span>
                  </div>
                  <Input />
                </div>
              </Form.Item>
              <Form.Item name="mlbHitter">
                <div className="hitter">
                  <div className="text">
                    <span>Hitters &#58;</span>
                  </div>
                  <Input />
                </div>
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="soccer">
          <div className="container">
            <div className="soccer-logo">{getLabel(soccer, 'SOCCER')}</div>
            <div className="player-type">
              <Form.Item name="soccerGK">
                <div className="gk">
                  <div className="text">
                    <span>GoalKeeper &#58;</span>
                  </div>
                  <Input />
                </div>
              </Form.Item>
              <Form.Item name="soccerfp1">
                <div className="fp">
                  <div className="text">
                    <span>FieldPlayer &#58;</span>
                  </div>
                  <Input />
                </div>
              </Form.Item>
              <Form.Item name="soccerfp2">
                <div className="fp">
                  <div className="text">
                    <span>FieldPlayer &#58;</span>
                  </div>
                  <Input />
                </div>
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
