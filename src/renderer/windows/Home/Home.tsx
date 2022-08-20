// Import Modules
import { useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

// Import Utils
import {
  isSaltMinionConfigured,
  isSaltMinionInstalled,
} from 'utils/helperFunctions';

// Import Components
import InstallationModal from 'renderer/components/Home/InstallationModal';

// Import Styles
import { HomeWrapper } from './Home.styles';
import ConfiguarionModal from 'renderer/components/ConfigurationModal';
import { ids } from 'webpack';

const Home = () => {
  const [status, setStatus] = useState<
    'loading' | 'error' | 'installed' | 'configured' | 'idle' | 'success'
  >('idle');
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkInstallation = async () => {
    const isInstalled = await isSaltMinionInstalled();
    const isMinionConfigured = await isSaltMinionConfigured();
    if (isInstalled && isMinionConfigured) navigate('/dashboard');

    setCheckCompleted(true);
  };

  useEffect(() => {
    checkInstallation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'success') navigate('/dashboard');
  }, [status]);

  const handleGetStarted = async () => {
    setStatus('loading');
    const isInstalled = await isSaltMinionInstalled();
    const isMinionConfigured = await isSaltMinionConfigured();

    if (isInstalled) {
      message.success('Installation Found');
      setStatus('installed');
    } else {
      setStatus('error');
      return;
    }

    if (isMinionConfigured) {
      message.success('Minion Configured');
      setStatus('configured');
    } else {
      setStatus('installed');
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
      <ConfiguarionModal status={status} setStatus={setStatus} />
    </HomeWrapper>
  );
};

export default Home;
