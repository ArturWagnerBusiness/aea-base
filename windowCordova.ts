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

//@ts-ignore
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
              window.CORDOVA?.writeFileContent(fileEntry, "[]", (isSuccess) => {
                if (!isSuccess) console.log("Could not fill vaults.json");
                callback([]);
              });
            } else if (data !== null) {
              console.log("Got data  for vaults.json");
              callback(JSON.parse(data.toString()));
            } else {
              window.CORDOVA?.writeFileContent(fileEntry, "[]", (isSuccess) => {
                if (!isSuccess) console.log("Could not fill vaults.json");
                callback([]);
              });
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
              JSON.stringify(
                vaults.map((v) => {
                  return { name: v.name, path: v.path, algorithm: v.algorithm };
                })
              ),
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
  updateVault: (vault, callback) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        // New directory
        entry.getFile(
          vault.info.path + "information.json",
          { create: true },
          (file) => {
            console.log("Created information.json");
            //@ts-ignore
            const data = CryptoJS.AES.encrypt(
              JSON.stringify(vault),
              vault.info.password
            );
            window.CORDOVA?.writeFileContent(file, data.toString(), (state) => {
              console.log(
                "information.json encrypted data write was a - " + state
                  ? "success"
                  : "failure"
              );
            });
          }
        );
      },
      onError
    );
  },
  getVaultFolder: (root, name) => {
    if (name.length === 0)
      return {
        path: "",
        content: root,
      };
    let newContent = root.filter((thing) => thing.encoded_name === name[0]);
    let current = name.shift();
    let result = window.CORDOVA?.getVaultFolder(newContent[0].children, name);
    if (result)
      return {
        path: current + "/" + result.path,
        content: result.content,
      };
    console.log("Critical error is getVaultFolder()");
    throw "getVault Failed unexpectedly!";
  },
  getNextFreePath: (content) => {
    for (let x = 0; x < 50000; x++) {
      if (content.filter((item) => item.name === `${x}`).length === 0)
        return `${x}`;
    }
    return null;
  },
  vaultCreateEntry: (encodedLocation, name, type, vault, callback) => {
    const data = window.CORDOVA.getVaultFolder(vault.content, encodedLocation);
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        if (type === "folder") {
          entry.getDirectory(
            vault.info.path + data.path,
            { create: true },
            (status) => {
              console.log("status", status);
              let rawName = window.CORDOVA.getNextFreePath(data.content);
              if (rawName === null) {
                callback(false);
                return;
              }
              data.content.push({
                encoded_name: name,
                name: rawName,
                is_dir: true,
                children: [],
              });
              window.CORDOVA?.updateVault(vault, callback);
            }
          );
          // Same as "folder" but "file"
        } else if (type === "file") {
          entry.getFile(
            vault.info.path + data.path,
            { create: true },
            (status) => {
              console.log("status", status);
              let rawName = window.CORDOVA.getNextFreePath(data.content);
              if (rawName === null) {
                callback(false);
                return;
              }
              data.content.push({
                encoded_name: name,
                name: rawName,
                is_dir: false,
                children: [],
              });
              window.CORDOVA?.updateVault(vault, callback);
            }
          );
        }
      },
      onError
    );
  },
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
