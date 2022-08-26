import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import os from 'os';
import store from 'store/store';
import ip from 'ip';

export const isMac = () => os.platform() === 'darwin';

export const isLinux = () => os.platform() === 'linux';

export const getIpAddress = () => {
  return ip.address();
};

const executeCMDAsync = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      console.log('error', error);
      console.log('stdout', stdout);
      console.log('stderr', stderr);

      if (error) reject(error);

      if (stderr) reject(stderr);

      resolve(stdout);
    });
  });
};

export const getLinuxReleaseDetails = async () => {
  const res = await readFile('/etc/os-release', 'utf-8');

  const releaseDetails: Record<string, string> = {};

  res.split('\n').forEach((line) => {
    if (!line) return;
    console.log(line);

    const words = line.split('=');
    releaseDetails[words[0].trim().toLowerCase()] = words[1].trim();
  });

  console.dir(releaseDetails);

  return releaseDetails;
};

const executeSudoCMDAsync = (cmd: string, pwd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`echo ${pwd} | ${cmd}`, (error, stdout, stderr) => {
      if (error) reject(error);

      if (stderr) reject(stderr);

      resolve(stdout);
    });
  });
};

export const isSaltMinionInstalled = async () => {
  try {
    return !!(await executeCMDAsync('salt-minion --version'));
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};

export const installSaltMinion = async () => {
  try {
    const pwd = store.get('password');

    if (!pwd) {
      throw new Error('Password not found');
    }

    if (isMac()) {
      await executeCMDAsync('brew install saltstack');
      await executeSudoCMDAsync('sudo -S mkdir /etc/salt', pwd).catch((err) =>
        console.error(err)
      );

      await executeSudoCMDAsync('sudo -S touch /etc/salt/master', pwd).catch(
        (err) => console.error(err)
      );
    } else if (isLinux()) {
      const releaseDetails = await getLinuxReleaseDetails();

      if (releaseDetails.id_like.includes('debian')) {
        await executeSudoCMDAsync(
          'sudo -S apt-get install -y salt-api salt-cloud salt-minion salt-ssh salt-syndic',
          pwd
        );
      } else if (releaseDetails.id_like.includes('fedora')) {
        await executeSudoCMDAsync('sudo -S yum install -y salt-minion', pwd);
      } else {
        throw new Error('Unsupported Platform');
      }
    } else {
      throw new Error('Unsupported Platform');
    }
    return true;
  } catch (error: any) {
    console.log(error.message, error.stack);
    return false;
  }
};

export const isSaltMinionConfigured = async () => {
  const pwd = store.get('password');
  if (!pwd) return false;
  try {
    const isMasterInFile = await executeSudoCMDAsync(
      "sudo -S cat /etc/salt/minion | grep '^master:'",
      pwd
    );
    return !!isMasterInFile;
  } catch (err) {
    console.log('err', err);
    return false;
  }
};

export const writeMinionId = async (minionId: string) => {
  const pwd = store.get('password');
  let linenumber = '';
  let out;
  try {
    out = await executeSudoCMDAsync(
      "sudo -S cat /etc/salt/minion | grep -n '^id:'",
      pwd
    );
    if (!out) {
      out = await executeSudoCMDAsync(
        "sudo -S cat /etc/salt/minion | grep -n '^#id:'",
        pwd
      );
    }
  } catch (err) {
    console.log(err);
  }
  if (out) {
    for (let i = 0; i < out.length; i += 1) {
      if (out[i] === ':') break;
      linenumber += out[i];
    }
    await executeSudoCMDAsync(
      `sudo -S sed -i '${linenumber}s/.*/id: ${minionId}/' /etc/salt/minion`,
      pwd
    );
  } else {
    await executeSudoCMDAsync(
      `sudo -S sh -c "echo 'id: ${minionId}' >> /etc/salt/minion"`,
      pwd
    );
  }
};

export const writeMasterIp = async (masterIp: string) => {
  const pwd = store.get('password');
  let linenumber = '';
  let out;
  try {
    out = await executeSudoCMDAsync(
      "sudo -S cat /etc/salt/minion | grep -n '^master:'",
      pwd
    );

    if (!out) {
      out = await executeSudoCMDAsync(
        "sudo -S cat /etc/salt/minion | grep -n '^#master:'",
        pwd
      );
    }
  } catch (err) {
    console.log('err', err);
  }
  if (out) {
    for (let i = 0; i < out.length; i += 1) {
      if (out[i] === ':') break;
      linenumber += out[i];
    }
    await executeSudoCMDAsync(
      `sudo -S sed -i '${linenumber}s/.*/master: ${masterIp}/' /etc/salt/minion`,
      pwd
    );
  } else {
    await executeSudoCMDAsync(
      `sudo -S sh -c "echo 'master: ${masterIp}' >> /etc/salt/minion"`,
      pwd
    );
  }
};

export const restartMinion = async () => {
  const pwd = store.get('password');
  await executeSudoCMDAsync(`sudo -S service salt-minion restart`, pwd);
};
    
export const isWindows = () => process.platform.toLowerCase().includes('win');
