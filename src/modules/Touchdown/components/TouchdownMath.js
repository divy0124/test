import { InfoCircleOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Col, Form, Input, Row, Space, message, theme } from 'antd';
import { useEffect, useState } from 'react';

import { CREATE_OR_UPDATE_MATH_CONSTANT } from 'graphql/mutations';
import { GET_MATH_CONSTANT } from 'graphql/queries';

import '../../../assets/styles/touchdown-math.less';

export default function TouchdownMath() {
  const [form] = Form.useForm();
  const [getMathConstants] = useLazyQuery(GET_MATH_CONSTANT);
  const [createOrUpdateMathConstants] = useMutation(
    CREATE_OR_UPDATE_MATH_CONSTANT,
  );

  const [constant, setConstant] = useState(null);
  const [obj, setObj] = useState([]);

  const onFinish = async () => {
    const inputData = [];
    obj.forEach((data) => {
      inputData.push({
        ...data,
        value: constant[data.name],
        __typename: undefined,
      });
    });

    const numberRegex = /^-?\d*\.?\d+$/;
    let validValues = true;
    inputData.forEach((data) => {
      if (!numberRegex.test(data.value)) validValues = false;
    });
    if (!validValues) {
      message.error('Only Numbers allowed.');
      return;
    }

    createOrUpdateMathConstants({ variables: { mathConstant: inputData } })
      .then(() => {
        message.success('Equation updated');
      })
      .catch((error) => {
        message.error(error?.message);
      });
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
    getMathConstants().then(({ data }) => {
      const { getMathConstant } = data;
      const initialValues = {};
      getMathConstant.forEach((con) => {
        initialValues[con.name] = con.value;
      });
      setConstant({ ...initialValues });
      setObj([...getMathConstant]);
    });
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
              rules={[
                {
                  required:
                    constant.PRIZE_POOL === undefined ||
                    constant.PRIZE_POOL === null ||
                    Number.isNaN(constant.PRIZE_POOL),
                  message: 'Is required',
                },
              ]}
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
                    rules={[
                      {
                        required:
                          constant.SIX_FOR_SEVEN_NUMERATOR === undefined ||
                          constant.SIX_FOR_SEVEN_NUMERATOR === null ||
                          Number.isNaN(constant.SIX_FOR_SEVEN_NUMERATOR),
                        message: 'Is required',
                      },
                    ]}
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
                    rules={[
                      {
                        required:
                          constant.SIX_FOR_SEVEN_DENOMINATOR === undefined ||
                          constant.SIX_FOR_SEVEN_DENOMINATOR === null ||
                          Number.isNaN(constant.SIX_FOR_SEVEN_DENOMINATOR),
                        message: 'Is required',
                      },
                    ]}
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
              rules={[{ required: true, message: 'Is required' }]}
            >
              <pre>
                {' '}
                Round (( &nbsp;
                <Input
                  defaultValue={constant.SIX_FOR_SEVEN_RESERVE}
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
              rules={[
                {
                  required:
                    constant.WEEKLY_RESERVE === undefined ||
                    constant.WEEKLY_RESERVE === null ||
                    Number.isNaN(constant.WEEKLY_RESERVE),
                  message: 'Is required',
                },
              ]}
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
