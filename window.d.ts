interface I_VaultInformation {
  name: string;
  path: string;
  password: string;
  algorithm: "AES";
}

interface I_Vault {
  info: I_VaultInformation;
  content: I_VaultContentItem[];
  is_open: boolean;
}

interface I_VaultContentItem {
  encoded_name: string;
  name: string;
  is_dir: boolean;
  children: I_VaultContentItem[];
}

type I_ChangeScreen = (arg: I_ScreenTypeOption) => void;

type I_ScreenTypeOption = "Homepage" | "CreateVault" | "Settings" | "VaultView";

interface I_VaultCreationInformation {
  name: string;
  path: string;
}

type callback<type> = (data: type) => void;

interface I_WindowCordova {
  loadVaults: (callback: callback<I_VaultInformation[]>) => void;
  saveVaults: (
    vaults: I_VaultInformation[],
    callback: callback<boolean>
  ) => void;
  openVault: (
    info: I_VaultInformation,
    callback: callback<I_Vault | null>
  ) => void;
  updateVault: (vault: I_Vault, callback: callback<boolean>) => void;
  getVaultFolder: (
    root: I_VaultContentItem[],
    encodedLocation: string[]
  ) => {
    path: string;
    raw: string;
    content: I_VaultContentItem[];
  };
  vaultCreateEntry: (
    encodedLocation: string[],
    name: string,
    type: "folder" | "file",
    vault: I_Vault,
    callback: callback<boolean>
  ) => void;
  performVaultFileOperation: (
    encodedLocation: string[],
    name: string,
    vault: I_Vault,
    action: "read" | "write",
    data: string,
    callback: callback<boolean | string>
  ) => void;
  getFileContent: (
    file: FileEntry,
    callback: callback<string | ArrayBuffer | null>
  ) => void;
  getNextFreePath: (content: I_VaultContentItem[]) => string | null;
  writeFileContent: (
    file: FileEntry,
    content: string,
    callback: callback<boolean>
  ) => void;
  createVault: (
    info: I_VaultInformation,
    callback: callback<I_Vault | null>
  ) => void;
  vaultCreateFile: (
    data: string,
    vault: I_Vault,
    callback: callback<boolean>
  ) => void;
  getFileFromUserNative: (callback: callback<string>) => void;
}

interface Window {
  CORDOVA: I_WindowCordova;
}
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
