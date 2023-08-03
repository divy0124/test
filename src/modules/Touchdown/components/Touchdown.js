/* eslint-disable */
import { InfoCircleOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form, Input, Row, Tooltip, message } from 'antd';
import cx from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useState } from 'react';

import Button from 'components/base/components/Button';
import WeekPicker from 'components/base/components/DatePicker/WeekPicker';
import { BackArrowIcon } from 'components/core/Icons';
import {
  CREATE_PRIZE_POOL,
  CREATE_TOUCHDOWN,
  UPDATE_PRIZE_POOL,
} from 'graphql/mutations';
import {
  GET_MATH_CONSTANT,
  GET_TOUCHDOWN_BY_DATE_CUSTOM,
} from 'graphql/queries';
import { EST_TIME_ZONE, YYYY_MM_DD } from 'utils/constants/labels';
import { validateNumber } from 'utils/helpers/validation';

import emptySelection from '../../../assets/images/empty-selection.svg';
import '../../../assets/styles/touchdown.less';

const initTouchdownData = {
  touchdownId: 0,
  startDate: null,
  endDate: null,
  weeklyPrize: '0',
  touchDownType: '7 FOR 7',
  totalWeeklyReserve: 0,
  totalTopPropVig: 0,
};

const initPrizePoolData = {
  entryFees: 0,
  totalEntrants: 0,
  supportedSports: ['NBA', 'MLB', 'Soccer'],
  actualReserveAmount: {
    SIX_FOR_SEVEN: 0,
  },
  predetermineReserveAmount: {
    SIX_FOR_SEVEN: 0,
  },
  predetermineJackpot: 0,
  predeterminePrizePool: 0,
  predetermineTopPropFees: 0,
  predetermineWeeklyReserveAmount: 0,
  actualJackpotAmount: 0,
  actualWeeklyReserveAmount: 0,
  startDate: 0,
  status: 'PENDING', // default status for upcoming | current weeks
  prizePool: 0,
  maxEntriesPerUser: 0,
  actualTopPropFees: 0,
  userEntryCount: 0,
};

const currentDate = dayjs();

function Touchdown() {
  const [prizePoolForm] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);
  const [activeBox, setActiveBox] = useState(0);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [touchdownInfo, setTouchdownInfo] = useState(null);
  const [disable, setDisable] = useState(true);
  const [mathConstants, setMathConstants] = useState({});
  const [selectedPrizePoolId, setSelectedPrizePoolId] = useState(0);

  const [getTouchDown] = useLazyQuery(GET_TOUCHDOWN_BY_DATE_CUSTOM);
  const [getMathConstant] = useLazyQuery(GET_MATH_CONSTANT);
  const [createTouchdown] = useMutation(CREATE_TOUCHDOWN);
  const [createPrizePool] = useMutation(CREATE_PRIZE_POOL);
  const [updatePrizePool] = useMutation(UPDATE_PRIZE_POOL);

  const setPrizePoolFormValues = (prizePoolData = null) => {
    const prizePoolObj = {
      ...prizePoolData,
      predetermineSixForSevenAmount:
        prizePoolData.predetermineReserveAmount.SIX_FOR_SEVEN,
    };
    prizePoolForm.setFieldsValue(prizePoolObj);
  };

  const getTouchDownByDateRange = async (dateRange) => {
    const startDate = dayjs(dateRange[0], YYYY_MM_DD).format(YYYY_MM_DD);
    const endDate = dayjs(dateRange[1], YYYY_MM_DD).format(YYYY_MM_DD);

    getTouchDown({ variables: { startDate, endDate } })
      .then(({ data }) => {
        const dates = [];
        let mondayDate = dayjs.tz(dateRange[0], EST_TIME_ZONE).startOf('day');
        const sundayDate = dayjs.tz(dateRange[1], EST_TIME_ZONE).endOf('day');
        while (
          mondayDate.isBefore(sundayDate) ||
          mondayDate.isSame(sundayDate)
        ) {
          dates.push(mondayDate.utc());
          mondayDate = mondayDate.add(1, 'day');
        }

        const { getTouchdownByDate } = data;
        const firstObj = getTouchdownByDate[0];

        if (firstObj) {
          let totalWeeklyReserve = 0;
          let totalTopPropVig = 0;

          firstObj.prizePools.forEach(
            ({ actualTopPropFees, actualWeeklyReserveAmount }) => {
              if (actualTopPropFees != null) {
                totalTopPropVig += actualTopPropFees;
              }
              if (totalWeeklyReserve != null) {
                totalWeeklyReserve += actualWeeklyReserveAmount;
              }
            },
          );

          const prizePools = dates.map((date) => ({
            ...(firstObj.prizePools.find(({ startDate }) =>
              dayjs(startDate).isSame(date),
            ) || { ...initPrizePoolData, startDate: date }),
          }));

          const currentPrizePool = prizePools[0];
          const { prizePoolId, status } = currentPrizePool;
          setSelectedPrizePoolId(prizePoolId);
          setDisable(['COMPLETED', 'LIVE'].includes(status));
          setTouchdownInfo({
            ...firstObj,
            prizePools,
            totalWeeklyReserve,
            totalTopPropVig,
          });

          setPrizePoolFormValues(currentPrizePool);
          const { mathConstant } = firstObj;

          setMathConstants(mathConstant);
        } else {
          const prizePools = dates.map((date) => ({
            ...initPrizePoolData,
            startDate: date,
          }));
          const touchdownInfo = {
            ...initTouchdownData,
            prizePools,
            startDate: dates[0],
            endDate: dates[6],
          };
          const currentPrizePool = prizePools[0];
          setDisable(['COMPLETED', 'LIVE'].includes(currentPrizePool.status));
          setTouchdownInfo(touchdownInfo);
          setPrizePoolFormValues(currentPrizePool);
          getTouchdownMath();
        }
      })
      .catch((error) => {
        message.error(error?.message);
      });
  };

  const getTouchdownMath = () => {
    getMathConstant().then(({ data }) => {
      const { getMathConstant } = data;
      if (getMathConstant.length > 0) {
        const constantObj = getMathConstant.reduce((acc, { name, value }) => {
          acc[name] = value;
          return acc;
        }, {});
        setMathConstants(constantObj);
      } else {
        message.error('Add Math constant into database.');
      }
    });
  };

  const handlePrizePoolChange = (index, data) => {
    const { prizePoolId, status, startDate: selectedDate } = data;
    const selectedPrizePool = touchdownInfo.prizePools.find(
      ({ startDate }) => startDate === selectedDate,
    );
    setActiveBox(index);
    setSelectedPrizePoolId(prizePoolId || 0);
    setDisable(['COMPLETED', 'LIVE'].includes(status));
    setPrizePoolFormValues(selectedPrizePool);
  };

  const handleDateChange = (date) => {
    const monday = date.startOf('week').format(YYYY_MM_DD);
    const sunday = date.endOf('week').format(YYYY_MM_DD);
    const selectedWeek = [monday, sunday];
    prizePoolForm.resetFields();
    setActiveBox(0);
    setDateRange([...selectedWeek]);
    setSelectedDate(date);
    getTouchDownByDateRange(selectedWeek);
    // getTouchdownMath();
  };

  const disablePreviousWeeksDate = (current) => {
    const startOfCurrentWeek = dayjs().startOf('week');
    return current && current < startOfCurrentWeek;
  };

  const handleChange = (changedValues, allValues) => {
    if (changedValues.entryFees || changedValues.totalEntrants) {
      const entryFees = Number(allValues.entryFees);
      const totalEntrants = Number(allValues.totalEntrants);
      const {
        PRIZE_POOL,
        WEEKLY_RESERVE, // In percentage
        SIX_FOR_SEVEN_DENOMINATOR,
        SIX_FOR_SEVEN_NUMERATOR,
        SIX_FOR_SEVEN_RESERVE,
      } = mathConstants;

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

      setPrizePoolFormValues({
        predeterminePrizePool: prizePoolAmount,
        predetermineJackpot: jackpotAmount,
        predetermineReserveAmount: { SIX_FOR_SEVEN: sixForSevenAmount },
        predetermineWeeklyReserveAmount: weeklyReserveAmount,
        predetermineTopPropFees: topPropVig,
      });
    }
  };

  const callCreateTouchdown = (values) => {
    if (activeBox !== 0) {
      message.error('First create the monday touchdown !');
      return;
    }
    const [startDate, endDate] = dateRange;
    const data = {
      ...values,
      touchdownType: 'SEVEN_FOR_SEVEN',
      startDate,
      endDate,
      mathConstant: mathConstants,
    };

    createTouchdown({
      variables: { data },
    })
      .then((res) => {
        const { createTouchdown } = res.data || {};
        if (createTouchdown) {
          const { touchdownId, startDate, endDate, touchDownType, prizePool } =
            createTouchdown;
          const createdObj = {
            ...touchdownInfo,
            touchdownId,
            startDate,
            endDate,
            touchDownType,
          };
          const prizePools = [...createdObj.prizePools];
          const createdPrizePool = prizePool[0];
          prizePools[0] = createdPrizePool;
          setSelectedPrizePoolId(createdPrizePool.prizePoolId);
          setTouchdownInfo({
            ...createdObj,
            prizePools,
          });
          message.success('Touchdown created successfully !');
        }
      })
      .catch((err) => {
        message.error(err?.message || 'Error creating touchdown !');
      });
  };

  const callCreateOrUpdatePrizePool = (data, prizePoolId) => {
    if (prizePoolId) {
      updatePrizePool({ variables: { data, prizePoolId } }).then((res) => {
        const { updatePrizePool } = res.data || {};
        if (updatePrizePool) {
          const copyPrizePools = [...touchdownInfo.prizePools];
          copyPrizePools[activeBox] = {
            ...initPrizePoolData,
            ...updatePrizePool,
          };

          setTouchdownInfo({
            ...touchdownInfo,
            prizePools: copyPrizePools,
          });
          message.success('PrizePool updated successfully !');
        }
      });
    } else {
      createPrizePool({ variables: { data, prizePoolId } }).then((res) => {
        const { createPrizePool } = res.data || {};
        if (createPrizePool) {
          const copyPrizePools = [...touchdownInfo.prizePools];
          copyPrizePools[activeBox] = {
            ...initPrizePoolData,
            ...createPrizePool,
          };
          setSelectedPrizePoolId(createPrizePool.prizePoolId);
          setTouchdownInfo({
            ...touchdownInfo,
            prizePools: copyPrizePools,
          });
          message.success('PrizePool created successfully !');
        }
      });
    }
  };

  const onFinish = (values) => {
    const { supportedSports } = initPrizePoolData;
    const predetermineReserveAmount = {
      SIX_FOR_SEVEN: Number(values.predetermineSixForSevenAmount),
    };
    const updatedValues = Object.entries(values).reduce(
      (acc, [key, value]) => {
        acc[key] = Number(value);
        return acc;
      },
      { supportedSports, predetermineReserveAmount },
    );
    delete updatedValues.predetermineSixForSevenAmount;

    const { touchdownId, prizePools } = touchdownInfo;

    if (touchdownId) {
      const prizeDate = dayjs(prizePools[activeBox].startDate).format(
        YYYY_MM_DD,
      );
      updatedValues.touchdownId = touchdownId;
      updatedValues.status = 'DRAFT';
      updatedValues.touchdownId = touchdownId;
      updatedValues.prizeDate = prizeDate;
      callCreateOrUpdatePrizePool(updatedValues, selectedPrizePoolId);
    } else {
      callCreateTouchdown(updatedValues);
    }
  };

  const activePrizePool = touchdownInfo?.prizePools[activeBox] || {};
  const {
    actualReserveAmount,
    actualJackpotAmount,
    actualTopPropFees,
    actualWeeklyReserveAmount,
    prizePool,
    predetermineJackpot,
    predeterminePrizePool,
    predetermineReserveAmount,
    predetermineTopPropFees,
    predetermineWeeklyReserveAmount,
    totalEntrants, // Predetermine
    userEntryCount, // Actual
  } = activePrizePool || {};
  const { PRIZE_POOL, SIX_FOR_SEVEN_RESERVE, WEEKLY_RESERVE } = mathConstants;

  const completedMetrics = [
    {
      name: 'Prize Pool',
      actual: prizePool || 0,
      predetermine: predeterminePrizePool || 0,
      tooltipValue: `Formula to count prize pool:\n ( Entry fee * Entrants ) * ${PRIZE_POOL}`,
    },
    {
      name: '7-for-7',
      actual: actualJackpotAmount || 0,
      predetermine: predetermineJackpot || 0,
      tooltipValue: `Formula to count 7-for-7: \n ( Prize pool - Weekly Reserve \n -6-for-7 Reserve )`,
    },
    {
      name: '6-for-7',
      actual: actualReserveAmount?.SIX_FOR_SEVEN || 0,
      predetermine: predetermineReserveAmount?.SIX_FOR_SEVEN || 0,
      tooltipValue: `Formula to calculate 6-For-7: \n Round( (${SIX_FOR_SEVEN_RESERVE} * Entry Fee) * X 6-For-7, 1 )`,
    },

    {
      name: 'Weekly reserve',
      actual: actualWeeklyReserveAmount || 0,
      predetermine: predetermineWeeklyReserveAmount || 0,
      tooltipValue: ` Formula to calculate weekly reserve:\n (${WEEKLY_RESERVE} % Prize Pool )`,
    },

    {
      name: 'TopProp vig',
      actual: actualTopPropFees || 0,
      predetermine: predetermineTopPropFees || 0,
      tooltipValue: ` Formula to calculate topprop vig: \n ( Entrants - Entry Fee )- Prize Pool`,
    },

    {
      name: 'Entry',
      actual: userEntryCount,
      predetermine: totalEntrants,
    },
  ];

  const dailyMetrics = [
    {
      labelName: 'Prize pool',
      formItemName: 'predeterminePrizePool',
      tooltipValue: `Formula to count prize pool:\n ( Entry fee * Entrants ) * ${PRIZE_POOL}`,
    },
    {
      labelName: '7-for-7',
      formItemName: 'predetermineJackpot',
      tooltipValue: `Formula to count 7-for-7: \n ( Prize pool - Weekly Reserve \n -6-for-7 Reserve )`,
    },
    {
      labelName: '6-for-7',
      formItemName: 'predetermineSixForSevenAmount',
      tooltipValue: `Formula to calculate 6-For-7: \n Round( (${SIX_FOR_SEVEN_RESERVE} * Entry Fee) * X 6-For-7, 1 )`,
    },
    {
      labelName: 'Weekly reserve',
      formItemName: 'predetermineWeeklyReserveAmount',
      tooltipValue: ` Formula to calculate weekly reserve:\n (${WEEKLY_RESERVE} % Prize Pool )`,
    },
    {
      labelName: 'TopProp vig',
      formItemName: 'predetermineTopPropFees',
      tooltipValue: ` Formula to calculate topprop vig: \n ( Entrants - Entry Fee )- Prize Pool`,
    },
  ];

  return (
    <div className="container">
      <Row className="text-medium font-alegreya mb-20 pointer back-arrow">
        <BackArrowIcon /> &nbsp; BACK
      </Row>

      <div className="week-selection">
        <Form
          className={cx(
            dateRange.length === 0 ? 'before-selection' : 'after-selection',
          )}
          form={prizePoolForm}
          layout="vertical"
          requiredMark={false}
          onValuesChange={handleChange}
          onFinish={onFinish}
        >
          <Row gutter={110}>
            <Col span={6}>
              <Form.Item colon={false} label="Select week">
                <WeekPicker
                  customDateDisable={disablePreviousWeeksDate}
                  dateRange={dateRange}
                  iconColor={dateRange.length === 0 ? '#d4d4d4' : '#B69056'}
                  onChange={handleDateChange}
                  selectedDate={selectedDate}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                className={cx('entry-fee', disable && 'disable')}
                colon={false}
                label="Entry fee"
                name="entryFees"
                rules={validateNumber('Entry fee')}
              >
                <Input
                  className={cx(disable ? 'disable-color' : '@color-black-100')}
                  disabled={disable}
                  prefix="$"
                />
              </Form.Item>
            </Col>
            <Col offset={6} span={4} style={{ textAlign: 'right' }}>
              <Form.Item className="save-btn-item" colon={false}>
                <Button
                  buttonText="SAVE"
                  className={cx('fw-500 fs-16 save-btn')}
                  disabled={disable}
                  htmlType="submit"
                  style={{ padding: '8px 50px' }}
                  variant="btn-primary"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {dateRange.length === 0 ? (
        <Col className="empty-date">
          <Row align="middle" className="font-alegreya mb-20 " justify="center">
            <img alt="Loading..." src={emptySelection} />
          </Row>
          <Row align="middle" className="font-alegreya mb-20" justify="center">
            <span>Please select week to proceed further </span>
          </Row>
        </Col>
      ) : (
        <div className="box">
          <div className="touchdown">
            <p>Select Day</p>

            {touchdownInfo && (
              <Row className="row-1" justify="space-between">
                {touchdownInfo.prizePools.map(
                  ({ prizePoolId, status, startDate }, index) => (
                    <Col
                      key={startDate}
                      className={cx(
                        `box${index + 1}`,
                        `${status.toLowerCase()}-box`,
                        activeBox === index &&
                          `border-${status.toLowerCase()}-box`,
                      )}
                      onClick={() =>
                        handlePrizePoolChange(index, {
                          prizePoolId,
                          status,
                          startDate,
                        })
                      }
                      span={3}
                    >
                      <Row className="datetime" justify="center">
                        {dayjs(startDate)
                          .format('DD ddd')
                          .split(' ')
                          .map((e, i) => (
                            <span className={cx(i === 0 ? 'date' : 'day')}>
                              {e}
                            </span>
                          ))}
                      </Row>
                      <Row className="status" justify="center">
                        {status}
                      </Row>
                    </Col>
                  ),
                )}
              </Row>
            )}
            <Row className="row-2">
              <Form
                form={prizePoolForm}
                layout="vertical"
                onValuesChange={handleChange}
                onFinish={onFinish}
              >
                <Form.Item
                  className={cx(disable ? 'border-disable' : 'border-enable')}
                  colon={false}
                  label="Entrants"
                  name="totalEntrants"
                  rules={validateNumber('Entrants')}
                >
                  <Input disabled={disable} placeholder="Enter entrants" />
                </Form.Item>
                <Form.Item
                  className={cx(disable ? 'border-disable' : 'border-enable')}
                  disabled={disable}
                  label="Max Entries"
                  name="maxEntriesPerUser"
                  rules={validateNumber('Max Entries')}
                >
                  <Input
                    disabled={disable}
                    placeholder="Enter max entries per user"
                  />
                </Form.Item>
              </Form>
            </Row>
            <Row className="row-4" gutter={24}>
              <Col className="daily-matrix" span={12}>
                <p>Daily Metrics</p>
                <div className="box-daily">
                  {touchdownInfo &&
                  touchdownInfo.prizePools[activeBox].status === 'COMPLETED' ? (
                    <div className="completed">
                      <Col>
                        <Row className="col-title">
                          <Col className="empty" span={8}>
                            &nbsp;
                          </Col>
                          <Col className="pre" span={8}>
                            Pre
                          </Col>
                          <Col className="post" span={8}>
                            Post
                          </Col>
                        </Row>
                        {completedMetrics.map(
                          ({ name, tooltipValue, actual, predetermine }) => (
                            <Row key={name} className="col-value">
                              <Col className="empty-val" span={8}>
                                {name}

                                {tooltipValue && (
                                  <Tooltip
                                    color="#fff"
                                    placement="bottom"
                                    style={{ width: '1500px' }}
                                    title={
                                      <span
                                        style={{
                                          color: '#212121',
                                          fontFamily: 'Calluna Sans',
                                          fontSize: '14px',
                                          fontWeight: '400px',
                                          lineHeight: '22px',
                                          whiteSpace: 'pre-line',
                                        }}
                                      >
                                        {tooltipValue}
                                      </span>
                                    }
                                    z-zIndex="1"
                                  >
                                    <InfoCircleOutlined />
                                  </Tooltip>
                                )}
                              </Col>
                              <Col className="pre-val" span={8}>
                                {tooltipValue && '$'}
                                {predetermine}
                              </Col>
                              <Col className="post-val" span={8}>
                                {tooltipValue && '$'}
                                {actual}
                              </Col>
                            </Row>
                          ),
                        )}
                      </Col>
                    </div>
                  ) : (
                    <Form
                      className="pp-form"
                      form={prizePoolForm}
                      layout="vertical"
                      requiredMark={false}
                      onValuesChange={handleChange}
                      onFinish={onFinish}
                    >
                      <Row gutter={20}>
                        {dailyMetrics.map(
                          ({ labelName, formItemName, tooltipValue }) => (
                            <Col key={labelName} span={11}>
                              <Form.Item
                                className={cx(disable && 'disabled')}
                                colon={false}
                                label={
                                  <>
                                    {labelName}
                                    <Tooltip
                                      color="#fff"
                                      placement="bottom"
                                      style={{ width: '1500px' }}
                                      title={
                                        <span
                                          style={{
                                            color: '#212121',
                                            fontFamily: 'Calluna Sans',
                                            fontSize: '14px',
                                            fontWeight: '400px',
                                            lineHeight: '22px',
                                            whiteSpace: 'pre-line',
                                          }}
                                        >
                                          {tooltipValue}
                                        </span>
                                      }
                                      zIndex="1"
                                    >
                                      <InfoCircleOutlined />
                                    </Tooltip>
                                  </>
                                }
                                name={formItemName}
                                rules={validateNumber(labelName)}
                              >
                                <Input disabled={disable} prefix="$" />
                              </Form.Item>
                            </Col>
                          ),
                        )}
                      </Row>
                    </Form>
                  )}
                </div>
              </Col>
              <Col className="weekly-matrix" span={12}>
                <p>Weekly Metrics</p>
                <div className="box-weekly">
                  <Row>
                    <Col span={8}>Days</Col>
                    <Col span={8}>Weekly Reserve</Col>
                    <Col span={8}>TopProp Vig</Col>
                  </Row>
                  {touchdownInfo?.prizePools?.map(
                    ({
                      startDate,
                      actualTopPropFees,
                      actualWeeklyReserveAmount,
                    }) => (
                      <Row key={startDate}>
                        <Col span={8}>
                          {dayjs(startDate).format('DD-MM-YYYY')}
                        </Col>
                        <Col span={8}>
                          {actualWeeklyReserveAmount
                            ? `$ ${actualWeeklyReserveAmount}`
                            : '-'}
                        </Col>
                        <Col span={8}>
                          {actualTopPropFees ? `$ ${actualTopPropFees}` : '-'}
                        </Col>
                      </Row>
                    ),
                  )}
                  <Row>
                    <Col span={24}>
                      <hr
                        style={{
                          border: '1px solid #D9D9D9',
                          marginRight: '26px',
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>Total</Col>
                    <Col className="total-amount" span={8}>
                      ${touchdownInfo?.totalWeeklyReserve}
                    </Col>
                    <Col className="total-amount" span={8}>
                      {' '}
                      ${touchdownInfo?.totalTopPropVig}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

export default Touchdown;
