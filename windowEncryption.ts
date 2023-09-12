// This will be accessible over all
(window as Window).ENCRYPTION = {
  encryptFile: (path) => {
    // https://github.com/Ideas2IT/cordova-aes256/blob/master/README.md
    throw "Not implemented";
  },
  unlockVault: (path) => {
    // decrypt .settings.container.info
    throw "Not implemented";
  },
  lockVault: (path) => {
    // remove all data
    throw "Not implemented";
  },
  createVault: (info) => {
    return null;
  },
};
