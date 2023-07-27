import { InfoCircleOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Col, Form, Input, Row, Space, message, theme } from 'antd';
import { useEffect, useState } from 'react';

import { CREATE_OR_UPDATE_MATH_CONSTANT } from 'graphql/mutations';
import { GET_MATH_CONSTANT } from 'graphql/queries';

import '../../../assets/styles/touchdown-math.less';

const touchdownCalcRow1 = [
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
];

const touchdownCalcRow2 = [
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
];
export default function TouchdownMath() {
  const [form] = Form.useForm();
  const [getMathConstants] = useLazyQuery(GET_MATH_CONSTANT);
  const [createOrUpdateMathConstants] = useMutation(
    CREATE_OR_UPDATE_MATH_CONSTANT,
  );

  const [constant, setConstant] = useState(null);
  // rename this
  const [obj, setObj] = useState([]);

  const { token } = theme.useToken();

  const formStyle = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const onFinish = async () => {
    // const inputData = [];

    let inputData = obj.map((o) => ({ ...o, value: constant[o.name] }));
    // Remove unwanted typename fields
    inputData = inputData.map(({ id, name, value }) => ({
      id,
      name,
      value,
    }));
    const isInvalid = inputData.find((e) => !/^-?\d*\.?\d+$/.test(e.value));
    if (isInvalid) {
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
    const children = data.map(
      ({ key, className, label, name, disable, isInfo }) => (
        <Col key={key} className={className} span={5}>
          <Form.Item label={isInfo ? getLabel(label) : label} name={name}>
            <Input disabled={disable} />
          </Form.Item>
        </Col>
      ),
    );

    return children;
  };

  useEffect(() => {
    getMathConstants().then(({ data }) => {
      const { getMathConstant } = data;
      const initialValues = {};
      getMathConstant.forEach((con) => {
        initialValues[con.name] = con.value;
      });
      console.log(getMathConstant);
      setConstant({ ...initialValues });
      setObj([...getMathConstant]);
    });
  }, []);

  const {
    PRIZE_POOL,
    SIX_FOR_SEVEN_NUMERATOR,
    SIX_FOR_SEVEN_DENOMINATOR,
    SIX_FOR_SEVEN_RESERVE,
    WEEKLY_RESERVE,
  } = constant || {};

  return (
    <div className="touchdown-math">
      <div className="equation">
        {constant && (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              colon={false}
              label={<div className="label-name">prize pool :</div>}
              name="PRIZE_POOL"
              rules={[
                {
                  required: Number.isNaN(PRIZE_POOL),
                  message: 'Is required',
                },
              ]}
            >
              <div className="prizePoolConstant">
                <pre>( entrants &nbsp; X &nbsp; entry fee ) &nbsp;&nbsp;X </pre>
                <Input
                  defaultValue={() => PRIZE_POOL}
                  onChange={(e) => handleChange(e.target.value, 'PRIZE_POOL')}
                />
              </div>
            </Form.Item>
            <div className="six-for-seven-var">
              <div className="label-name">x 6-for-7 :</div>
              <pre>
                {' '}
                ( &nbsp;
                <Space.Compact>
                  <Form.Item
                    className="numerator"
                    name="SIX_FOR_SEVEN_NUMERATOR"
                    rules={[
                      {
                        required: Number.isNaN(SIX_FOR_SEVEN_NUMERATOR),
                        message: 'Is required',
                      },
                    ]}
                  >
                    <Input
                      defaultValue={() => SIX_FOR_SEVEN_NUMERATOR}
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
                        required: Number.isNaN(SIX_FOR_SEVEN_DENOMINATOR),
                        message: 'Is required',
                      },
                    ]}
                  >
                    <Input
                      defaultValue={() => SIX_FOR_SEVEN_DENOMINATOR}
                      onChange={(e) =>
                        handleChange(
                          e.target.value,
                          'SIX_FOR_SEVEN_DENOMINATOR',
                        )
                      }
                      onPressEnter={(event) => event.preventDefault()}
                    />
                  </Form.Item>
                </Space.Compact>
                &nbsp; ) &nbsp; X &nbsp; Entrants
              </pre>
            </div>
            <Form.Item
              className="SixForSevenReserveConstant"
              colon={false}
              label={<div className="label-name">6-for-7 reserve:</div>}
              rules={[{ required: true, message: 'Is required' }]}
            >
              <pre>
                Round (( &nbsp;
                <Input
                  defaultValue={SIX_FOR_SEVEN_RESERVE}
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
              label={<div className="label-name">weekly reserve :</div>}
              name="WEEKLY_RESERVE"
              rules={[
                {
                  required: Number.isNaN(WEEKLY_RESERVE),
                  message: 'Is required',
                },
              ]}
            >
              <pre>
                <Input
                  defaultValue={() => WEEKLY_RESERVE}
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
              label={<div className="label-name">jackpot:</div>}
            >
              <pre>
                Prize Prize &nbsp; - &nbsp; Weekly Reserve &nbsp; - &nbsp;6 For
                7 Reserve
              </pre>
            </Form.Item>
            <Form.Item
              className="profit"
              colon={false}
              label={<div className="label-name">Topprop Vig:</div>}
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
              {getFields(touchdownCalcRow1)}
            </Row>

            <Row className="row-2">{getFields(touchdownCalcRow2)}</Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
