import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Space, message, theme } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import '../../../assets/styles/touchdown-math.less';

export default function TouchdownMath() {
  const [form] = Form.useForm();

  const [constant, setConstant] = useState(null);
  const [obj, setObj] = useState([]);

  const onFinish = async () => {
    const inputData = [];
    console.log('CON ', constant);
    obj.forEach((data) => {
      inputData.push({ ...data, value: constant[data.name] });
    });

    const response = await axios
      .post('http://localhost:5008/api/admin/touchdown/math', inputData)
      .catch((error) => {
        message.error(error?.message);
      });

    if (response.status === 201) {
      message.success('Equation updated');
    }
  };

  function getLable(name) {
    return <div className="label-name">{name}</div>;
  }
  const { token } = theme.useToken();

  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const handleChange = (value, constantName) => {
    setConstant({ ...constant, [constantName]: parseFloat(value) });
  };

  function getLabel(label) {
    return (
      <>
        {label} <InfoCircleOutlined style={{ paddingLeft: '4px' }} />
      </>
    );
  }
  const getFields = (data) => {
    const children = [];
    for (let i = 0; i < data.length; i += 1) {
      const { key, className, label, name, disable, isInfo } = data[i];
      children.push(
        <Col key={key} className={className} span={5}>
          <Form.Item label={isInfo ? getLabel(label) : label} name={name}>
            <Input disabled={disable} />
          </Form.Item>
        </Col>,
      );
    }
    return children;
  };

  useEffect(() => {
    async function fetchData() {
      const initialValues = {};
      const { data } = await axios.get(
        'http://localhost:5008/api/admin/touchdown/math',
      );
      data.forEach((con) => {
        initialValues[con.name] = con.value;
      });
      setConstant({ ...initialValues });
      setObj(data);
      console.log('contest :>> ', constant);
    }
    fetchData();
  }, []);

  return (
    <div className="touchdown-math">
      <div className="equation">
        {constant && (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              colon={false}
              label={getLable('prize pool :')}
              name="PRIZE_POOL"
              // rules={[{ required: true, message: 'Is required' }]}
            >
              <div className="prizePoolConstant">
                <pre>
                  {' '}
                  ( entrants &nbsp; X &nbsp; entry fee ) &nbsp;&nbsp;X{' '}
                </pre>
                <Input
                  defaultValue={() => constant.PRIZE_POOL}
                  onChange={(e) => handleChange(e.target.value, 'PRIZE_POOL')}
                />
              </div>
            </Form.Item>

            <div className="six-for-seven-var">
              {getLable('x 6-for-7 :')}

              <pre>
                {' '}
                ( &nbsp;
                <Space.Compact>
                  <Form.Item
                    className="numerator"
                    name="SIX_FOR_SEVEN_NUMERATOR"
                    // rules={[{ required: true, message: 'Is required' }]}
                  >
                    <Input
                      defaultValue={() => constant.SIX_FOR_SEVEN_NUMERATOR}
                      onChange={(e) =>
                        handleChange(e.target.value, 'SIX_FOR_SEVEN_NUMERATOR')
                      }
                      onPressEnter={(event) => event.preventDefault()}
                    />
                  </Form.Item>{' '}
                  &nbsp; / &nbsp;
                  <Form.Item
                    className="denominator"
                    name="SIX_FOR_SEVEN_DENOMINATOR"
                    // rules={[{ required: true, message: 'Is required' }]}
                  >
                    <Input
                      defaultValue={() => constant.SIX_FOR_SEVEN_DENOMINATOR}
                      onChange={(e) =>
                        handleChange(
                          e.target.value,
                          'SIX_FOR_SEVEN_DENOMINATOR',
                        )
                      }
                      onPressEnter={(event) => event.preventDefault()}
                    />
                  </Form.Item>
                </Space.Compact>{' '}
                &nbsp; ) &nbsp; X &nbsp; Entrants
              </pre>
            </div>
            <Form.Item
              className="SixForSevenReserveConstant"
              colon={false}
              label={getLable('6-for-7 reserve:')}
              // rules={[{ required: true, message: 'Is required' }]}
              style={{ marginBottom: 0 }}
            >
              <pre>
                {' '}
                Round (( &nbsp;
                <Input
                  defaultValue={() => constant.SIX_FOR_SEVEN_RESERVE}
                  onChange={(e) =>
                    handleChange(e.target.value, 'SIX_FOR_SEVEN_RESERVE')
                  }
                  onPressEnter={(event) => event.preventDefault()}
                />
                {'  '}&nbsp; X &nbsp;Entry Fee) &nbsp; X &nbsp; &nbsp;x 6-for-7
                , 1 )
              </pre>
            </Form.Item>

            <Form.Item
              className="weekly-reserve"
              colon={false}
              label={getLable('weekly reserve :')}
              name="WEEKLY_RESERVE"
              // rules={[{ required: true, message: 'Is required' }]}
            >
              <pre>
                <Input
                  defaultValue={() => constant.WEEKLY_RESERVE}
                  onChange={(e) =>
                    handleChange(e.target.value, 'WEEKLY_RESERVE')
                  }
                  onPressEnter={(event) => event.preventDefault()}
                />{' '}
                &nbsp; % &nbsp;Prize Pool
              </pre>
            </Form.Item>

            <Form.Item
              className="jackpot"
              colon={false}
              label={getLable('jackpot:')}
            >
              <pre>
                Prize Prize &nbsp; - &nbsp; Weekly Reserve &nbsp; - &nbsp;6 For
                7 Reserve
              </pre>
            </Form.Item>

            <Form.Item
              className="profit"
              colon={false}
              label={getLable('Topprop Vig:')}
            >
              <pre>
                ( Entrants &nbsp; X &nbsp;Entry Fee )&nbsp; - &nbsp;Prize Pool
              </pre>
            </Form.Item>
            <Form.Item className="save" colon={false} label=" ">
              <Button htmlType="submit" type="primary">
                SAVE
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      <div className="calculator">
        <h1>Touchdown calculator</h1>

        <div className="container">
          <Form
            form={form}
            layout="vertical"
            name="advanced_search"
            onFinish={onFinish}
            style={formStyle}
          >
            <Row className="row-1" gutter={24}>
              {getFields([
                {
                  key: 1,
                  label: 'Entry fee',
                  placeholder: '',
                  name: 'entryFee',
                  className: 'row-1-col-1',
                },
                {
                  key: 2,
                  label: 'Entrants',
                  placeholder: 'Enter entrants',
                  name: 'entrants',
                  className: 'row-1-col-2',
                },
              ])}
            </Row>

            <Row className="row-2">
              {getFields([
                {
                  key: 3,
                  label: 'Prize pool',
                  placeholder: '',
                  name: 'prizePool',
                  className: 'row-2-col1',
                  disable: true,
                  isInfo: true,
                },
                {
                  key: 4,
                  label: '7-for-7',
                  placeholder: '',
                  name: 'sevenForSeven',
                  className: 'row-2-col2',
                  disable: true,
                  isInfo: true,
                },
                {
                  key: 5,
                  label: '6-for-7',
                  placeholder: '',
                  name: 'sixForSeven',
                  className: 'row-2-col3',
                  disable: true,
                  isInfo: true,
                },
                {
                  key: 6,
                  label: 'Weekly Reserve',
                  placeholder: 'Enter entrants',
                  name: 'weeklyReserve',
                  className: 'row-2-col4',
                  disable: true,
                  isInfo: true,
                },
                {
                  key: 7,
                  label: 'Topprop Vig',
                  placeholder: '',
                  name: 'toppropVig',
                  className: 'row-2-col5',
                  disable: true,
                  isInfo: true,
                },
              ])}
            </Row>

            {/* <div style={{ textAlign: 'right' }} /> */}
          </Form>
        </div>
      </div>
    </div>
  );
}
