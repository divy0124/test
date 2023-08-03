import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Col, Form, Input, Row, message } from 'antd';
import cx from 'classnames';
import { useEffect, useState } from 'react';

import { CREATE_OR_UPDATE_MATH_CONSTANT } from 'graphql/mutations';
import { GET_MATH_CONSTANT } from 'graphql/queries';
import { validateNumber } from 'utils/helpers/validation';

import '../../../assets/styles/touchdown-math.less';

const touchdownCalcRow1 = [
  {
    key: 1,
    label: 'Entry fee',
    placeholder: '',
    name: 'entryFee',
  },
  {
    key: 2,
    label: 'Entrants',
    placeholder: 'Enter entrants',
    name: 'entrants',
  },
];

const touchdownCalcRow2 = [
  {
    key: 3,
    label: 'Prize pool',
    placeholder: '',
    name: 'prizePool',
    disable: true,
  },
  {
    key: 4,
    label: '7-for-7',
    placeholder: '',
    name: 'sevenForSeven',
    disable: true,
  },
  {
    key: 5,
    label: '6-for-7',
    placeholder: '',
    name: 'sixForSeven',
    disable: true,
  },
  {
    key: 6,
    label: 'Weekly Reserve',
    placeholder: 'Enter entrants',
    name: 'weeklyReserve',
    disable: true,
  },
  {
    key: 7,
    label: 'Topprop Vig',
    placeholder: '',
    name: 'toppropVig',
    disable: true,
  },
];
export default function TouchdownMath() {
  const [form] = Form.useForm();
  const [calcForm] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const watch = Form.useWatch([], calcForm);

  const [getMathConstants] = useLazyQuery(GET_MATH_CONSTANT);
  const [createOrUpdateMathConstants] = useMutation(
    CREATE_OR_UPDATE_MATH_CONSTANT,
  );

  const [constant, setConstant] = useState([]);

  const {
    PRIZE_POOL,
    SIX_FOR_SEVEN_NUMERATOR,
    SIX_FOR_SEVEN_DENOMINATOR,
    SIX_FOR_SEVEN_RESERVE,
    WEEKLY_RESERVE,
  } =
    constant.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {}) || {};

  const calculatePrizePoolVal = (entryFees, totalEntrants) => {
    console.log(PRIZE_POOL, SIX_FOR_SEVEN_NUMERATOR);
    const prizePoolAmount = parseFloat(
      (totalEntrants * entryFees * PRIZE_POOL).toFixed(2),
    );
    const xSixForSeven = parseFloat(
      (SIX_FOR_SEVEN_NUMERATOR / SIX_FOR_SEVEN_DENOMINATOR) * totalEntrants,
    );
    const sixForSevenAmount =
      Math.round(
        SIX_FOR_SEVEN_RESERVE * parseInt(entryFees, 10) * xSixForSeven * 10,
      ) / 10;
    const weeklyReserveAmount =
      parseFloat((WEEKLY_RESERVE * prizePoolAmount).toFixed(2)) / 100;
    const jackpotAmount = parseFloat(
      (prizePoolAmount - weeklyReserveAmount - sixForSevenAmount).toFixed(2),
    );
    const topPropVig = parseFloat(
      (totalEntrants * entryFees - prizePoolAmount).toFixed(2),
    );
    calcForm.setFieldsValue({
      prizePool: prizePoolAmount,
      sevenForSeven: jackpotAmount,
      sixForSeven: sixForSevenAmount,
      weeklyReserve: weeklyReserveAmount,
      toppropVig: topPropVig,
    });
  };

  const onFinish = async () => {
    const data = form.getFieldsValue();
    const inputData = constant.map(({ id, name }) => ({
      id,
      name,
      value: parseFloat(data[name]),
    }));
    createOrUpdateMathConstants({ variables: { mathConstant: inputData } })
      .then((res) => {
        const { data } = res;
        const { createOrUpdateMathConstant } = data;
        if (createOrUpdateMathConstant.length > 0) {
          setConstant([...createOrUpdateMathConstant]);
        }
        message.success('Equation updated');
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };
  useEffect(() => {
    if (constant.length === 0) {
      getMathConstants().then(({ data }) => {
        const { getMathConstant } = data;
        setConstant([...getMathConstant]);
        const initialValues = getMathConstant.reduce((acc, { name, value }) => {
          acc[name] = value;
          return acc;
        }, {});
        form.setFieldsValue(initialValues);
      });
    } else {
      const entryFee = calcForm.getFieldValue('entryFee');
      const entrants = calcForm.getFieldValue('entrants');
      if (entryFee && entrants) {
        calculatePrizePoolVal(entryFee, entrants);
      }
    }
  }, [constant]);

  const handleChangeValues = (changedValues, allValues) => {
    if (allValues.entryFee && allValues.entrants) {
      const entryFees = Number(allValues.entryFee) || 0;
      const totalEntrants = Number(allValues.entrants) || 0;

      calculatePrizePoolVal(entryFees, totalEntrants);
    }
    if (allValues.entryFee === '' && allValues.entrants === '') {
      calcForm.setFieldsValue({
        prizePool: '',
        sevenForSeven: '',
        sixForSeven: '',
        weeklyReserve: '',
        toppropVig: '',
      });
    }
  };

  return (
    <div className="touchdown-math">
      <div className="equation">
        {constant && (
          <Form
            className="equation-form"
            colon={false}
            form={form}
            onFinish={onFinish}
          >
            <Row>
              <Col className="label-name" span={4}>
                prize pool :
              </Col>
              <Col span={10}>
                <span>
                  ( entrants &nbsp; X &nbsp; entry fee )
                  &nbsp;&nbsp;X&nbsp;&nbsp;{' '}
                </span>
                <Form.Item
                  name="PRIZE_POOL"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                    {
                      pattern: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Invalid',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col className="label-name" span={4}>
                x 6-for-7 :
              </Col>
              <Col span={10}>
                <span>( &nbsp;</span>
                <Form.Item
                  name="SIX_FOR_SEVEN_NUMERATOR"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                    {
                      pattern: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Invalid',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span>&nbsp; / &nbsp;</span>
                <Form.Item
                  name="SIX_FOR_SEVEN_DENOMINATOR"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                    {
                      pattern: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Invalid',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span>&nbsp; ) &nbsp; X &nbsp; Entrants</span>
              </Col>
            </Row>
            <Row>
              <Col className="label-name" span={4}>
                6-for-7 reserve:
              </Col>
              <Col span={10}>
                <span>Round (&nbsp;( &nbsp;</span>
                <Form.Item
                  name="SIX_FOR_SEVEN_RESERVE"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                    {
                      pattern: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Invalid',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span>
                  &nbsp; X &nbsp;Entry Fee) &nbsp; X &nbsp; &nbsp;x 6-for-7 , 1
                  )
                </span>
              </Col>
            </Row>
            <Row>
              <Col className="label-name" span={4}>
                weekly reserve :
              </Col>
              <Col span={10}>
                <Form.Item
                  name="WEEKLY_RESERVE"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                    {
                      pattern: /^[0-9]+(\.[0-9]+)?$/,
                      message: 'Invalid',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <span>&nbsp; % &nbsp;Prize Pool</span>
              </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col className="label-name" span={4}>
                jackpot:
              </Col>
              <Col span={10}>
                {' '}
                <span>
                  Prize Prize &nbsp; - &nbsp; Weekly Reserve &nbsp; - &nbsp;6
                  For 7 Reserve
                </span>
              </Col>
            </Row>
            <Row style={{ marginTop: '46px' }}>
              <Col className="label-name" span={4}>
                Topprop Vig:
              </Col>
              <Col span={10}>
                <span>
                  ( Entrants &nbsp; X &nbsp;Entry Fee )&nbsp; - &nbsp;Prize Pool
                </span>
              </Col>
            </Row>
            <Row style={{ marginTop: '30px' }}>
              <Col span={4}>
                <Form.Item>
                  <Button htmlType="submit">SAVE</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </div>
      <div className="calculator">
        <div className="calc-title">Touchdown calculator</div>

        <div className="calc-container">
          <Form
            form={calcForm}
            layout="vertical"
            name="td-calc-form"
            onValuesChange={handleChangeValues}
          >
            <Row className="td-calc-row-1" gutter={24}>
              {touchdownCalcRow1.map(({ key, label, name, placeholder }) => (
                <Col key={key}>
                  <Form.Item
                    label={label}
                    name={name}
                    rules={validateNumber(name)}
                  >
                    <Input
                      className={cx(
                        calcForm.getFieldValue(name)
                          ? 'val-fill'
                          : 'val-not-filled',
                      )}
                      placeholder={placeholder}
                      prefix="$"
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>

            <Row className="td-calc-row-2" gutter={24}>
              {touchdownCalcRow2.map(({ key, label, name }) => (
                <Col key={key}>
                  <Form.Item label={label} name={name}>
                    <Input
                      className={cx(
                        calcForm.getFieldValue(name)
                          ? 'val-fill'
                          : 'val-not-filled',
                      )}
                      disabled="true"
                      prefix={calcForm.getFieldValue(name) ? '$' : '-'}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
