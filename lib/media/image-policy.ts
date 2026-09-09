export const allowedImageSources = [
  'direct-owned',
  'client-provided-rights-confirmed',
  'cc0',
  'cc-by',
  'pexels',
  'unsplash',
  'pixabay',
  'text-card-generated'
] as const;

export type AllowedImageSource = (typeof allowedImageSources)[number];

export const prohibitedAutoImageSignals = [
  'recognizable-person-without-release',
  'visible-brand-logo-or-trademark',
  'medical-before-after',
  'official-government-looking-seal',
  'ai-generated-realistic-news-photo',
  'non-commercial-license',
  'no-derivatives-license',
  'unclear-license',
  'misleading-or-deceptive-context'
] as const;

export const autoPublishImagePolicy = {
  defaultVisualMode: 'text-card-generated',
  allowAiPhotoByDefault: false,
  requireLicenseMetadataForExternalPhoto: true,
  requireCaption: true,
  preferTextCardForInformationalArticles: true,
  captionTemplate: '▲ {title} 관련 자료 이미지. 출처={source}, 라이선스={license}',
  copyrightNotice: '<저작권자 ⓒ 생활경제저널 무단전재 및 재배포 금지>'
};

export function isExternalPhotoAllowedForAutoPublish(input: {
  source?: string | null;
  license?: string | null;
  hasRecognizablePerson?: boolean;
  hasLogoOrTrademark?: boolean;
  isAiGenerated?: boolean;
}) {
  const source = input.source?.trim().toLowerCase();
  const license = input.license?.trim().toLowerCase();

  if (input.isAiGenerated) return false;
  if (input.hasRecognizablePerson) return false;
  if (input.hasLogoOrTrademark) return false;
  if (!source || !license) return false;
  if (license.includes('noncommercial') || license.includes('by-nc') || license.includes('nd')) return false;

  return allowedImageSources.some((allowed) => source.includes(allowed)) || license.includes('cc0') || license.includes('cc by');
}
