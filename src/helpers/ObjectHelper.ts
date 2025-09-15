export class ObjectHelper {
  static filterMap(data?: object): string {
    if (data)
      return Object.entries(data)
        .map(([key, value]) =>
          Array.isArray(value)
            ? value
                .map((obj: any) => `${encodeURIComponent(key)}=${obj}`)
                .join("&")
            : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
    return "";
  }
}
