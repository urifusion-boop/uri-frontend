import 'react-phone-number-input/style.css';

import { marked } from 'marked';
import { PaymentHelper } from './PaymentHelper';

export class TextHelper {
  static formatNumberWithCommas(numberString: string): string {
    return parseInt(numberString).toLocaleString();
  }

  static capitalize(text: string | undefined) {
    if (!text) return '';

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static getFormattedDate = (date: string) => {
    const dateObject = new Date(date);

    // Extracting day, month, and year components
    const day = dateObject.getUTCDate();
    const month = dateObject.getUTCMonth() + 1; // Month is zero-based, so we add 1
    const year = dateObject.getUTCFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    // Formatting the date components to the desired format
    return `${day < 10 ? '0' : ''}${day} ${months[month - 1]}, ${year}`;
  };

  static getFormattedTime(dateString: string) {
    const date = new Date(dateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return formattedHours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;
  }

  static truncateText(text: string | undefined, length: number, character: string) {
    if (!text) return '';
    if (text.length > length) {
      return text.substring(0, length) + character;
    } else {
      return text;
    }
  }

  static isNumber(text: string) {
    return !/\D/.test(text);
  }

  static isYoutubeUrl(url: string) {
    const youtubeRegex = /^((?:https?:)?\/\/)?((?:www\.)?((?:youtube\.com|youtu\.be))\/(?:(embed\/|v\/|watch\?v=|shorts\/)?)([\w-]+)(\S+)?)?$/;

    return youtubeRegex.test(url);
  }

  static containsPhoneNumber(text: string) {
    const phoneRegex = /\b(?:\+?(\d{1,3}))?[-. (]*?(\d{3})[-. )]*?(\d{3})[-. ]*(\d{4})\b/g;
    return phoneRegex.test(text);
  }

  static containsNumber(text: string) {
    const numberRegex = /\d/;
    return numberRegex.test(text);
  }

  static containsEmail(text: string) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return emailRegex.test(text);
  }

  static joinText(text: string) {
    return text.trim().replace(/\s+/g, '_');
  }

  static removeChar(text: string, charsToRemove: string): string {
    // Escape special regex characters in charsToRemove
    const escapedChars = charsToRemove.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Create a dynamic regular expression to match all specified characters
    const pattern = new RegExp(`[${escapedChars}]`, 'g');

    return text?.replace(pattern, ' ').trim();
  }

  static setUrl(url: string = '') {
    if (url && url.length > 0 && !url.startsWith('http')) return `${process.env.NEXT_PUBLIC_AZURE_BLOB_STORAGE_BASE_URL}${url.trim()}`;
    return url;
  }

  static formatAmount(num: number) {
    let formatter = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });

    // Format the number
    let formatted = formatter.format(num);

    // Remove ".00" if present
    return formatted.replace(/\.00(?=\s|$)/, '');
  }

  static formatShortAmount(num: number) {
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    let formatted = '';

    if (absNum >= 1_000_000_000) {
      formatted = `${(absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
    } else if (absNum >= 1_000_000) {
      formatted = `${(absNum / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    } else if (absNum >= 1_000) {
      formatted = `${(absNum / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    } else {
      formatted = absNum.toString();
    }

    return `${sign}₦${formatted}`;
  }

  static formatShortAmountWithDiscount(num: number, duration: string = '') {
    const amount = PaymentHelper.formatPaystackAmountToDecimal(num);
    return this.formatShortAmount(PaymentHelper.addDiscountToPaystackAmount(amount, duration));
  }

  static formatShortAmountWithoutDiscount(num: number) {
    const amount = PaymentHelper.formatPaystackAmountToDecimal(num);
    return this.formatShortAmount(amount);
  }

  static shortAmountWithDiscount(num: number, duration: string = '') {
    const amount = PaymentHelper.formatPaystackAmountToDecimal(num);
    console.log('discount check amount : ', duration);
    return PaymentHelper.addDiscountToPaystackAmount(amount, duration);
  }

  static addSuffix(num: number) {
    if (num % 100 >= 11 && num % 100 <= 13) {
      return num + 'th';
    }

    switch (num % 10) {
      case 1:
        return num + 'st';
      case 2:
        return num + 'nd';
      case 3:
        return num + 'rd';
      default:
        return num + 'th';
    }
  }

  static creativeCategoryTruncate(categories: string[]) {
    if (categories.length === 1) {
      return categories[0].charAt(0).toUpperCase() + categories[0].slice(1).toLowerCase().replace('_', ' ');
    } else if (categories.length > 1) {
      return categories[0].charAt(0).toUpperCase() + categories[0].slice(1).toLowerCase().replace('_', ' ') + ' ' + '+' + (categories.length - 1);
    } else return '';
  }

  static highlightKeywords(caption: string, keywords?: string[]): string {
    if (!keywords || keywords.length === 0) return caption;
    // Escape special characters in each keyword for regex safety
    const escapedKeywords = keywords.map((keyword) => keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Create a regex to match all keywords
    const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');

    // Replace matched keywords with highlighted text
    return caption.replace(regex, (match) => `<span class="highlight">${match}</span>`);
  }

  static getDomainName(url?: string) {
    if (!url) return '';

    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');

      return parts.length > 2 ? parts[1] : parts[0];
    } catch (error) {
      return url.replace(/.+\/\/|www.|\..+/g, '');
    }
  }

  static setFilePath(basePath: string, filePath: string, userId: string, fileName: string) {
    return basePath.replace('{0}', userId) + Date.now() + filePath.replace('{1}', fileName);
  }

  static formatTrackerDescriptionText(name: string | undefined, tracker: string[] | undefined, excluded: string[] | undefined) {
    const trackerText = tracker?.length ? `includes the keywords: ${tracker.join(', ')}` : 'includes no keywords';

    const excludedText = excluded?.length ? `and excludes the keywords: ${excluded.join(', ')}` : 'and excludes no keywords';

    return `Tracker "${name}" ${trackerText} ${excludedText}.`;
  }

  static readonly createMarkup = (text?: string) => {
    if (!text || typeof text !== 'string') return { __html: '' };
    return { __html: marked(text) };
  };

  static formatUrl = (url: string) => {
    if (url.length < 1) return url;

    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    return url;
  };

  static getLastItemOfUrl = (url: string): string => {
    const parts = url.split('/');
    let lastItem = parts.pop() || ''; // Get the last segment
    return lastItem.replace(/[^a-zA-Z0-9_-]/g, ''); // Remove special characters if needed
  };

  static generateReferenceForUser(prefix: string = ''): string {
    return `${prefix}-${new Date().getTime().toString()}`;
  }

  static convertToAcceptedDTO = <T extends Record<string, string>>(input: string, enumObject: T): string | undefined => {
    if (!input) return undefined;

    const normalizedInput = input?.trim()?.toUpperCase();

    const matchingKey = Object.keys(enumObject).find((key) => key === normalizedInput);

    return matchingKey ? enumObject[matchingKey] : undefined;
  };

  static getInitials = (name: string | undefined) => {
    if (!name) return '?';
    const words = name?.trim()?.split(' ');
    if (words?.length === 1) return words?.[0]?.[0]?.toUpperCase();
    return `${words?.[0]?.[0]}${words?.[1]?.[0]}`.toUpperCase();
  };
}
