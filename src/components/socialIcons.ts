import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  TelegramLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr'

/** Icon for each platform offered in Site settings → Social. */
export const socialIcons = {
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  tiktok: TiktokLogo,
  whatsapp: WhatsappLogo,
  telegram: TelegramLogo,
  linkedin: LinkedinLogo,
} as const

export const socialIcon = (platform?: string | null) =>
  platform ? socialIcons[platform as keyof typeof socialIcons] : undefined
