export {Site}
enum Site {
  US,
  JP,
  CN3,
  SG,
  EU
}

namespace Site {
  export function getBaseUrl(site: Site): string{
    switch (site) {
      case Site.US:
        return "https://api.kii.com";
      case Site.JP:
        return "https://api-jp.kii.com";
      case Site.CN3:
        return "https://api-cn3.kii.com";
      case Site.SG:
        return "https://api-sg.kii.com";
      case Site.EU:
          return "https://api-eu.kii.com"
    }
  }
}
