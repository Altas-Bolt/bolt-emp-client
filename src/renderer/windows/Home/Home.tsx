// Import Modules
import { useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

// Import Utils
import { isSaltMinionInstalled } from 'utils/helperFunctions';

// Import Components
import InstallationModal from 'renderer/components/Home/InstallationModal';

// Import Styles
import { HomeWrapper } from './Home.styles';

const Home = () => {
  const [status, setStatus] = useState<
    'loading' | 'error' | 'success' | 'idle'
  >('idle');
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkInstallation = async () => {
    const isInstalled = await isSaltMinionInstalled();

    if (isInstalled) navigate('/dashboard');

    setCheckCompleted(true);
  };

  useEffect(() => {
    checkInstallation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetStarted = async () => {
    setStatus('loading');
    const isInstalled = await isSaltMinionInstalled();

    if (isInstalled) {
      message.success('Installation Found');
      setStatus('success');
      navigate('/dashboard');
    } else {
      setStatus('error');
    }
  };

  if (!checkCompleted)
    return (
      <HomeWrapper>
        <Spin size="large" />
      </HomeWrapper>
    );

  return (
    <HomeWrapper>
      <div className="header">
        <h1>Bolt.</h1>
      </div>
      <div className="action">
        <Button
          type="primary"
          size="large"
          loading={status === 'loading'}
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
      <InstallationModal status={status} setStatus={setStatus} />
    </HomeWrapper>
  );
};

export default Home;
