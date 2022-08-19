// Import Modules
import { Input, message, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

// Import Utils
import { installSaltMinion } from 'utils/helperFunctions';

interface IProps {
  status: 'loading' | 'error' | 'success' | 'idle';
  setStatus: React.Dispatch<
    React.SetStateAction<'loading' | 'error' | 'success' | 'idle'>
  >;
}

const InstallationModal: React.FC<IProps> = ({ status, setStatus }) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(localStorage.getItem('pwd') || '');
  const navigate = useNavigate();

  const handleOk = async () => {
    try {
      setLoading(true);
      localStorage.setItem('pwd', password);
      await installSaltMinion();
      message.success('Installed successfully');
      navigate('/dashboard');
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
