/// <reference types="cordova-plugin-file" />

const onError = (info) => console.log("[C ERROR]", info);

window.CORDOVA = {
  loadVaults: (callback) => {
    window.resolveLocalFileSystemURL(
      cordova.file.externalDataDirectory,
      //@ts-ignore
      (entry: DirectoryEntry) => {
        entry.getFile("vaults.json", { create: true }, (fileEntry) => {
          window.CORDOVA?.getFileContent(fileEntry, (data) => {
            if (data === "") {
              window.CORDOVA?.writeFileContent(fileEntry, "{}", (isSuccess) => {
                if (!isSuccess) console.log("Could not fill vaults.json");
                callback([]);
              });
            } else if (typeof data === "string" && data.length > 0) {
              callback(JSON.parse(data));
            } else {
              console.log(
                "Unexpected data in vaults.json or missing permissions"
              );
              callback([]);
            }
          });
        });
      }
    );
  },
  getFileContent: (file, callback) => {
    file.file((blob) => {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(this.result);
      };
      reader.readAsText(blob);
    });
  },
  writeFileContent: (file, content, callback) => {
    file.createWriter((fileWriter) => {
      fileWriter.onwriteend = () => callback(true);
      fileWriter.onerror = (e) => callback(false);
      fileWriter.write(content);
    });
  },
  getFileFromUserNative: () => {
    throw "Not implemented";
  },
};
