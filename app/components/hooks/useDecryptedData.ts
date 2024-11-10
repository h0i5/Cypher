import { useState, useEffect } from "react";
const { convertFromAES } = require("@harshiyer/json-crypto");

export function useDecryptedData(
  encryptedVault: string,
  masterPassword: string,
  salt: string,
) {
  const [decryptedData, setDecryptedData] = useState(null);

  useEffect(() => {
    if (encryptedVault && masterPassword) {
      const decrypted = convertFromAES(encryptedVault, masterPassword, salt);
      setDecryptedData(decrypted);
    }
  }, [encryptedVault, masterPassword]);

  return decryptedData;
}

export default useDecryptedData;
