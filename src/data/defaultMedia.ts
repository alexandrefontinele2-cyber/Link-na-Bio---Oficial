/**
 * Default media bundle for Alexandre Fontinele's bio page.
 * High quality videos, motion gifs and curated photos built directly into the codebase
 * so they load instantly on Hostinger, Cloudflare, Vercel or any production host.
 */

export interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif';
  title?: string;
}

export const EMBEDDED_MARQUEE_ROW1: MediaAsset[] = [
  {
    id: 'm1-1',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-business-partners-working-together-in-an-office-43388-large.mp4',
    title: 'Liderança & Estratégia Corporativa',
  },
  {
    id: 'm1-2',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    title: 'Inovação e Resultados Exponenciais',
  },
  {
    id: 'm1-3',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-a-city-with-traffic-at-night-42211-large.mp4',
    title: 'Visão Global & Escala',
  },
  {
    id: 'm1-4',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
    title: 'Inteligência de Dados & Conversão',
  },
  {
    id: 'm1-5',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-43288-large.mp4',
    title: 'Execução & Métodos Ágeis',
  },
  {
    id: 'm1-6',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    title: 'IA e Automação',
  },
  {
    id: 'm1-7',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-delivering-a-speech-to-a-large-audience-43343-large.mp4',
    title: 'Palestras de Alto Impacto',
  },
  {
    id: 'm1-8',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    title: 'Performance & Treinamento',
  },
];

export const EMBEDDED_MARQUEE_ROW2: MediaAsset[] = [
  {
    id: 'm2-1',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-people-in-a-business-meeting-taking-notes-43389-large.mp4',
    title: 'Workshops & Treinamentos In-Company',
  },
  {
    id: 'm2-2',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    title: 'Ecossistema Digital',
  },
  {
    id: 'm2-3',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-financial-analyst-working-with-graphs-43403-large.mp4',
    title: 'Gestão Financeira & Alto Ticket',
  },
  {
    id: 'm2-4',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    title: 'Portfólio de Soluções',
  },
  {
    id: 'm2-5',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-at-a-reception-desk-in-a-clinic-44473-large.mp4',
    title: 'Clínicas & Simetria Perfeita',
  },
  {
    id: 'm2-6',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    title: 'Metodologias Validadas',
  },
  {
    id: 'm2-7',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-business-woman-using-a-tablet-in-a-modern-office-43394-large.mp4',
    title: 'Atendimento & Conversão no WhatsApp',
  },
  {
    id: 'm2-8',
    type: 'gif',
    url: 'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    title: 'Escalabilidade & Negócios',
  },
];
