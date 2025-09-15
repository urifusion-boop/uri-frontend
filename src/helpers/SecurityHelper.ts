import { TokenClaimsDto } from "@/models/dtos/TokenClaimsDto";
import axios from "axios";

export class SecurityHelper {
  static parseJwt(token: string): TokenClaimsDto | null {
    if (!token) {
      return null;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    const claims = JSON.parse(window.atob(base64)).claims;

    // Token validation should ideally be done server-side
    return claims; // This does not validate the token, only decodes it
  }

  // Utility function to convert URL-safe base64 string to Uint8Array
  static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  static async canEmbed(value: string) {
    const url = new URL(value)?.host?.toLowerCase().trim();

    try {
      const famousWebsite = [
        "youtube.com",
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "linkedin.com",
        "pinterest.com",
        "tiktok.com",
      ];

      if (famousWebsite.some((famous) => url.includes(famous))) {
        return false;
      }

      const response = await axios.head(url);
      const contentSecurityPolicy = response.headers["content-security-policy"];
      if (
        contentSecurityPolicy &&
        contentSecurityPolicy.includes("frame-ancestors")
      ) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error fetching CSP:", error);
      return false;
    }
  }
}
