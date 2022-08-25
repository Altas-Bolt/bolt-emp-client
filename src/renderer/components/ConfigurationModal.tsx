// Import Modules
import { Input, message, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// Import Utils
import {
  installSaltMinion,
  restartMinion,
  writeMasterIp,
  writeMinionId,
} from 'utils/helperFunctions';
import store from 'store/store';

interface IProps {
  status: 'loading' | 'error' | 'installed' | 'configured' | 'idle' | 'success';
  setStatus: React.Dispatch<
    React.SetStateAction<
      'loading' | 'error' | 'installed' | 'configured' | 'idle' | 'success'
    >
  >;
}

const ConfiguarionModal: React.FC<IProps> = ({ status, setStatus }) => {
  const [loading, setLoading] = useState(false);
  const [minionId, setMinionId] = useState('');
  const [masterIp, setMasterIp] = useState('');

  const handleOk = async () => {
    try {
      setLoading(true);
      await writeMinionId(minionId);
      await writeMasterIp(masterIp);
      await restartMinion();
      setStatus('configured');
    } catch (error: any) {
      message.error('Failed to configure');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Bolt Configuration Not Found"
      visible={status === 'installed'}
      onOk={handleOk}
      okText={loading ? 'Installing' : 'Install'}
      okButtonProps={{ disabled: !masterIp || !minionId }}
      onCancel={() => setStatus('idle')}
    >
      <p>Please configure in order to proceed.</p>
      <Input.Password
        placeholder="Enter your bolt-master IP"
        value={masterIp}
        onChange={(e) => setMasterIp(e.target.value)}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
      <Input.Password
        placeholder="Enter your minion id"
        value={minionId}
        onChange={(e) => setMinionId(e.target.value)}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Modal>
  );
};

export default ConfiguarionModal;
