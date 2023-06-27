import { Button, Form, Input, Space } from 'antd';

import '../../../assets/styles/touchdown-math.less';

export default function TouchdownMath() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
  };

  function getLable(name) {
    return <div className="label-name">{name}</div>;
  }

  return (
    <div className="touchdown-math">
      <div className="equation">
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            colon={false}
            label={getLable('prize pool :')}
            name="prizePoolConstant"
            // rules={[{ required: true, message: 'Constant is required' }]}
          >
            <div className="prizePoolConstant">
              <pre> ( entrants &nbsp; X &nbsp; entry fee ) &nbsp;&nbsp;X </pre>
              <Input onPressEnter={(event) => event.preventDefault()} />
            </div>
          </Form.Item>

          <Form.Item
            className="six-for-seven-var"
            colon={false}
            label={getLable('x 6-for-7 :')}
          >
            <pre>
              {' '}
              ( &nbsp;
              <Space.Compact>
                <Form.Item
                  className="numerator"
                  name={['numerator', 'numerator']}
                  // rules={[{ required: true, message: 'is required' }]}
                >
                  <Input onPressEnter={(event) => event.preventDefault()} />
                </Form.Item>{' '}
                &nbsp; / &nbsp;
                <Form.Item
                  className="denominator"
                  name={['denominator', 'denominator']}
                  // rules={[{ required: true, message: 'is required' }]}
                >
                  <Input onPressEnter={(event) => event.preventDefault()} />
                </Form.Item>
              </Space.Compact>{' '}
              &nbsp; ) &nbsp; X &nbsp; Entrants
            </pre>
          </Form.Item>

          <Form.Item
            className="SixForSevenReserveConstant"
            colon={false}
            label={getLable('6-for-7 reserve:')}
            style={{ marginBottom: 0 }}
          >
            <pre>
              {' '}
              Round (( &nbsp;
              <Form.Item
                name="6For7ReserveConstant"
                rules={[{ required: true, message: 'Is Required' }]}
              >
                <Input onPressEnter={(event) => event.preventDefault()} />
              </Form.Item>
              {'  '}&nbsp; X &nbsp;Entry Fee) &nbsp; X &nbsp; &nbsp;x 6-for-7 ,
              1 )
            </pre>
          </Form.Item>

          <Form.Item
            className="weekly-reserve"
            colon={false}
            label={getLable('weekly reserve :')}
          >
            <pre>
              <Input onPressEnter={(event) => event.preventDefault()} /> &nbsp;
              % &nbsp;Prize Pool
            </pre>
          </Form.Item>

          <Form.Item
            className="jackpot"
            colon={false}
            label={getLable('jackpot:')}
          >
            <pre>
              Prize Prize &nbsp; - &nbsp; Weekly Reserve &nbsp; - &nbsp;6 For 7
              Reserve
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
        <div className="calculator">
          <h1>Touchdown calculator</h1>
          <div className="container" />
        </div>
      </div>
    </div>
  );
}
