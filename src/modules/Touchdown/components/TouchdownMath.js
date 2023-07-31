import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Col, Form, Input, Row, Space, message } from 'antd';
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

  const [constant, setConstant] = useState(null);
  // rename this
  const [obj, setObj] = useState([]);
  const {
    PRIZE_POOL,
    SIX_FOR_SEVEN_NUMERATOR,
    SIX_FOR_SEVEN_DENOMINATOR,
    SIX_FOR_SEVEN_RESERVE,
    WEEKLY_RESERVE,
  } = constant || {};

  const calculatePrizePoolVal = (entryFees, totalEntrants) => {
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
      .then((res) => {
        const { data } = res;
        const { createOrUpdateMathConstant } = data;
        if (createOrUpdateMathConstant.length > 0) {
          const updatedMathCon = createOrUpdateMathConstant.reduce(
            (acc, { name, value }) => {
              acc[name] = value;
              return acc;
            },
            {},
          );
          setConstant(updatedMathCon);
          calculatePrizePoolVal(
            calcForm.getFieldValue('entryFee'),
            calcForm.getFieldValue('entrants'),
          );
        }
        message.success('Equation updated');
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };
  const handleChange = (value, constantName) => {
    setConstant({ ...constant, [constantName]: parseFloat(value) });
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
