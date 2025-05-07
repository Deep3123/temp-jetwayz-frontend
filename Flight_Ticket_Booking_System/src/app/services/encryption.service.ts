import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EncryptionService {
  private readonly SECRET_KEY = this.getKeyOrThrow(
    environment.encryption?.secretKey,
    "secretKey"
  );
  private readonly IV = this.getKeyOrThrow(environment.encryption?.iv, "iv");

  private getKeyOrThrow(
    value: string | undefined,
    keyName: string
  ): CryptoJS.lib.WordArray {
    if (!value) {
      console.error(
        `Encryption key '${keyName}' is undefined. Check your environment configuration.`
      );
      throw new Error(`Missing encryption key: ${keyName}`);
    }
    return CryptoJS.enc.Utf8.parse(value);
  }

  encrypt(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.SECRET_KEY, {
      iv: this.IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decrypt(ciphertext: string): string {
    try {
      const parsedBase64 = CryptoJS.enc.Base64.parse(ciphertext);
      const encryptedHex = parsedBase64.toString(CryptoJS.enc.Hex);

      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(encryptedHex),
      });

      const decrypted = CryptoJS.AES.decrypt(cipherParams, this.SECRET_KEY, {
        iv: this.IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw error;
    }
  }
}
