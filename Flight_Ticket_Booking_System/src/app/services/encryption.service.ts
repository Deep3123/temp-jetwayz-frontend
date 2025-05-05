import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { environment } from "../../environments/environment";
// import { environment_prod } from "../../environments/environment.prod.template";

@Injectable({
  providedIn: "root",
})
export class EncryptionService {
  // private readonly SECRET_KEY = CryptoJS.enc.Utf8.parse(
  //   process.env["ENCRYPTION_SECRET_KEY"] || ""
  // );

  // private readonly IV = CryptoJS.enc.Utf8.parse(
  //   process.env["ENCRYPTION_IV"] || ""
  // );

  private readonly SECRET_KEY = CryptoJS.enc.Utf8.parse(
    environment.encryption.secretKey
  );

  private readonly IV = CryptoJS.enc.Utf8.parse(environment.encryption.iv);

  // private readonly SECRET_KEY = CryptoJS.enc.Utf8.parse(
  //   environment_prod.encryption.secretKey
  // );

  // private readonly IV = CryptoJS.enc.Utf8.parse(environment_prod.encryption.iv);

  
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
      // Convert the Base64 string to a format CryptoJS can understand
      const parsedBase64 = CryptoJS.enc.Base64.parse(ciphertext);
      const encryptedHex = parsedBase64.toString(CryptoJS.enc.Hex);

      // Create a CipherParams object required by CryptoJS
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex.parse(encryptedHex),
      });

      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(cipherParams, this.SECRET_KEY, {
        iv: this.IV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption failed:", error);
      console.error("Ciphertext:", ciphertext);
      throw error;
    }
  }
}
