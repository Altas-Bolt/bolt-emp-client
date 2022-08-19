// Import Modules
import { Input, message, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// Import Utils
import { installSaltMinion } from 'utils/helperFunctions';
import store from 'store/store';

interface IProps {
  status: 'loading' | 'error' | 'installed' | 'configured' | 'idle' | 'success';
  setStatus: React.Dispatch<
    React.SetStateAction<
      'loading' | 'error' | 'installed' | 'configured' | 'idle' | 'success'
    >
  >;
}

const InstallationModal: React.FC<IProps> = ({ status, setStatus }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(store.get('password') || '');

  const handleOk = async () => {
    try {
      setLoading(true);
      store.set('password', password);
      await installSaltMinion();
      message.success('Installed successfully');
      setStatus('installed');
    } catch (error: any) {
      message.error('Failed to Install');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Bolt Installation Not Found"
      visible={status === 'error'}
      onOk={handleOk}
      okText={loading ? 'Installing' : 'Install'}
      okButtonProps={{ disabled: !password }}
      onCancel={() => setStatus('idle')}
    >
      <p>
        We could not find the installation for Bolt. Please install in order to
        proceed.
      </p>
      <Input.Password
        placeholder="Enter your sudo password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
      />
    </Modal>
  );
};

export default InstallationModal;
