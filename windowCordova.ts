/// <reference types="cordova-plugin-file" />

const onError = (info) => console.log("[C ERROR]", info);
window.addEventListener(
  "filePluginIsReady",
  function () {
    //@ts-ignore
    window.initPersistentFileSystem();
  },
  false
);

window.CORDOVA = {
  loadVaults: (callback) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        console.log("Attempting to load raw vaults.json");
        entry.getFile("vaults.json", { create: true }, (fileEntry) => {
          window.CORDOVA?.getFileContent(fileEntry, (data) => {
            if (data === "") {
              window.CORDOVA?.writeFileContent(fileEntry, "{}", (isSuccess) => {
                if (!isSuccess) console.log("Could not fill vaults.json");
                callback([]);
              });
            } else if (data !== null) {
              console.log("Got data  for vaults.json");
              callback(JSON.parse(data.toString()));
            } else {
              callback([]);
            }
          });
        });
      }
    );
  },
  saveVaults: (vaults, callback) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        // console.log("Attempting to save current vaults to vaults.json");
        entry.getFile(
          "vaults.json",
          { create: true },
          (fileEntry) => {
            // console.log("Saving...");
            window.CORDOVA?.writeFileContent(
              fileEntry,
              JSON.stringify(vaults),
              (s) => {
                // console.log("Write operation ", s ? "worked" : "failed");
                callback(s);
              }
            );
          },
          () => {
            callback(false);
          }
        );
      }
    );
  },
  openVault: (info, callback) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        console.log("Accessing vault storage");
        entry.getFile(
          info.path + "information.json",
          { create: true },
          (file) => {
            console.log("Reading information.json");
            window.CORDOVA?.getFileContent(file, (contentRaw) => {
              if (contentRaw) {
                try {
                  console.log("Decrypt file");
                  //@ts-ignore
                  let data = CryptoJS.AES.decrypt(
                    contentRaw + "",
                    info.password
                  );
                  //@ts-ignore
                  console.log(JSON.parse(data.toString(CryptoJS.enc.Utf8)));
                  //@ts-ignore
                  callback(JSON.parse(data.toString(CryptoJS.enc.Utf8)));
                } catch (e) {
                  console.log(e);
                  callback(null);
                }
              }
            });
          }
        );
      },
      onError
    );
  },
  createVault: (info, callback) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        // loops like these are bad but assuming no one will have 5000 or more vaults...
        const directoryLoop = (id_attempt) => {
          entry.getDirectory(
            `vault${id_attempt}`,
            {
              create: true,
              exclusive: true,
            },
            (dir) => {
              console.log("Created vault folder");
              // New directory
              info.path = dir.fullPath;
              const vaultToSend: I_Vault = {
                info: info,
                content: [],
                is_open: false,
              };
              dir.getFile("information.json", { create: true }, (file) => {
                console.log("Created information.json");
                //@ts-ignore
                const data = CryptoJS.AES.encrypt(
                  JSON.stringify(vaultToSend),
                  vaultToSend.info.password
                );
                window.CORDOVA?.writeFileContent(
                  file,
                  data.toString(),
                  (state) => {
                    console.log(
                      "information.json encrypted data write was a - " + state
                        ? "success"
                        : "failure"
                    );
                  }
                );
              });
              callback(vaultToSend);
            },
            () => {
              directoryLoop(id_attempt + 1); // Next
            }
          );
        };
        directoryLoop(0); // Start
      },
      onError
    );
  },
  vaultCreateFile: (data, vault, callback) => {},
  getFileContent: (file, callback) => {
    file.file((blob) => {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(this.result);
      };
      reader.onerror = (e) => console.log(e);
      reader.readAsText(blob);
    }, onError);
  },
  writeFileContent: (file, content, callback) => {
    file.createWriter((fileWriter) => {
      fileWriter.onwriteend = () => callback(true);
      fileWriter.onerror = (e) => {
        console.log(e);
        callback(false);
      };
      fileWriter.write(content);
    }, onError);
  },
  getFileFromUserNative: (callback) => {
    (async () => {
      //@ts-ignore
      const file = await chooser.getFileMetadata();
      if (file) {
        console.log(file);
        callback(file.name);
      } else callback("canceled");
    })();
  },
};
