interface I_VaultInformation {
  name: string;
  path: string;
  password: string | null;
  algorithm: "AES" | null;
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
  location: string;
  password: string;
}

interface I_WindowEncryption {
  encryptFile: (path: string) => void;
  unlockVault: (path: "Test") => I_Vault;
  lockVault: (path: string) => void;
  createVault: (info: I_VaultCreationInformation) => I_Vault | null;
}
interface I_WindowCordova {
  loadVaults: (callback: (vaults: I_Vault[]) => void) => void;
  getFileFromUserNative: () => never;
}
interface Window {
  ENCRYPTION: I_WindowEncryption | undefined;
  CORDOVA: I_WindowCordova | undefined;
}

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
