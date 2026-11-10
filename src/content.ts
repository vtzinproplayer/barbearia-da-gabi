// Todo o conteúdo editorial do site vive aqui. Alterar nomes, contactos,
// textos, imagens ou testemunhos não obriga a tocar nos componentes.
// Os serviços e horários ficam em src/shared/services.ts porque também são
// validados pelo Worker.

import { SERVICES } from './shared/services'

const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=82`

export const images = {
  hero: photo('1503951914875-452162b0f3f1', 1400),
  about: photo('1567894340315-735d7c361db0', 1200),
  services: photo('1621605815971-fbc98d665033', 1000),
  cta: photo('1512690459411-b9245aed614b', 1800),
}

export const brand = {
  name: 'Barbearia da Gabi',
  short: 'da Gabi',
  tagline: 'Cortes, barbas e cuidado com detalhe.',
  since: 2016,
  city: 'Porto',
}

export const contact = {
  phone: { label: '912 345 678', href: 'tel:+351912345678' },
  email: { label: 'ola@barbeariadagabi.pt', href: 'mailto:ola@barbeariadagabi.pt' },
  instagram: { label: '@barbeariadagabi', href: 'https://www.instagram.com/' },
  whatsapp: { label: 'WhatsApp', href: 'https://wa.me/351912345678' },
  address: 'Rua do Almada, 128',
  addressLine2: '4050-032 Porto',
  maps: 'https://www.google.com/maps/search/?api=1&query=Rua+do+Almada+128+Porto',
}

export const hours = [
  { days: 'Terça a sexta', time: '09:00 — 19:30' },
  { days: 'Sábado', time: '09:00 — 19:30' },
  { days: 'Domingo e segunda', time: 'Fechado', closed: true },
]

export const nav = {
  links: [
    { label: 'Serviços', href: '/#servicos' },
    { label: 'A barbearia', href: '/#barbearia' },
    { label: 'Galeria', href: '/#galeria' },
    { label: 'Contactos', href: '/#contactos' },
  ],
}

export const hero = {
  eyebrow: 'Porto · desde 2016',
  lines: ['O detalhe', 'que define'],
  emphasis: 'o seu estilo.',
  description:
    'Cortes desenhados à medida, barbas tratadas ao detalhe e um espaço onde o tempo abranda. Bem-vindo à Barbearia da Gabi.',
  primary: { label: 'Marcar horário', href: '/marcar' },
  secondary: { label: 'Conhecer os serviços', href: '#servicos' },
  imageCaption: 'Ritual de barba · toalha quente',
  note: 'Aberto de terça a sábado · 09:00 — 19:30',
  rating: { score: '4,9', reviews: '127 avaliações', clients: '2 500+' },
}

export const marquee = [
  'Corte Clássico',
  'Barba Tradicional',
  'Fade de Assinatura',
  'Toalha Quente',
  'Ritual Completo',
  'Cuidado com detalhe',
]

export const services = {
  eyebrow: 'Serviços',
  title: 'Rituais para o seu estilo',
  description:
    'Cada serviço começa com uma conversa e termina com um acabamento que se vê — e se sente.',
  note: 'Todos os serviços incluem lavagem, finalização e um café. Preços com IVA incluído.',
  items: SERVICES,
}

export const about = {
  eyebrow: 'A barbearia',
  title: 'Um ritual à sua medida, no coração do Porto.',
  paragraphs: [
    'A Barbearia da Gabi nasceu em 2016 de uma ideia simples: devolver ao corte de cabelo o tempo e a atenção que ele merece. Entre madeira, latão e o som das tesouras, cada visita foi pensada para ser uma pausa.',
    'Aqui não há pressa. Ouvimos, aconselhamos e desenhamos o corte que assenta em si — com produtos de barbearia escolhidos a dedo e o cuidado de quem faz isto por gosto.',
  ],
  quote: 'Um bom corte não muda só o visual. Muda a forma como se entra na sala.',
  signature: 'Gabi',
  role: 'Fundadora · Master Barber',
  imageCaption: 'No detalhe, todos os dias.',
  values: [
    { title: 'Atendimento personalizado', text: 'Uma cadeira, uma conversa e o tempo que o seu corte pede.' },
    { title: 'Produtos de autor', text: 'Marcas de barbearia escolhidas para cuidar, não só para vender.' },
    { title: 'Ambiente reservado', text: 'Luz baixa, música certa e a calma de um espaço só seu.' },
  ],
  stats: [
    { value: '2016', label: 'Desde' },
    { value: '2 500+', label: 'Cortes feitos' },
    { value: '4,9', label: 'Avaliação média' },
    { value: '6', label: 'Rituais' },
  ],
}

export type GalleryLayout = 'wide' | 'tall' | 'normal'

export const gallery = {
  eyebrow: 'O espaço',
  title: 'Pequenos detalhes, grandes rituais',
  description:
    'Madeira, couro e latão. Um espaço pensado para abrandar — e para sair de lá outro.',
  items: [
    {
      src: photo('1585747860715-2ba37e788b70', 1400),
      alt: 'Interior da barbearia com cadeiras de couro, tijolo e luzes quentes',
      caption: 'O nosso espaço',
      layout: 'wide' as GalleryLayout,
    },
    {
      src: photo('1622286342621-4bd786c2447c', 900),
      alt: 'Barbeiro a cortar o cabelo com máquina',
      caption: 'Precisão no detalhe',
      layout: 'tall' as GalleryLayout,
    },
    {
      src: photo('1600948836101-f9ffda59d250', 900),
      alt: 'Interior escuro e elegante de um espaço de barbearia',
      caption: 'Luz baixa, conversa boa',
      layout: 'tall' as GalleryLayout,
    },
    {
      src: photo('1512690459411-b9245aed614b', 900),
      alt: 'Cadeira de barbeiro em couro castanho',
      caption: 'O lugar é seu',
      layout: 'normal' as GalleryLayout,
    },
    {
      src: photo('1621605815971-fbc98d665033', 900),
      alt: 'Máquinas, tesouras e produtos de barbearia sobre madeira',
      caption: 'Ferramentas de ofício',
      layout: 'normal' as GalleryLayout,
    },
  ],
}

export const testimonials = [
  {
    quote:
      'Saio sempre com a sensação de ter sido atendido por quem realmente percebe do assunto. O cuidado com o detalhe é outro nível.',
    name: 'Miguel S.',
    service: 'Corte + Barba',
  },
  {
    quote:
      'Entrei pela primeira vez para um corte e fiquei cliente. O ambiente é calmo, a conversa é boa e o resultado fala por si.',
    name: 'André F.',
    service: 'Corte Clássico',
  },
  {
    quote:
      'A barba com toalha quente é um ritual à parte. Vou sempre embora com a sensação de ter pausado a semana.',
    name: 'Tiago M.',
    service: 'Barba com Toalha Quente',
  },
  {
    quote:
      'Há anos que não mudava de barbeiro. A Gabi ouviu o que eu queria, aconselhou e acertou à primeira. Já não vou a outro lado.',
    name: 'Rui P.',
    service: 'Fade de Assinatura',
  },
]

export const faq = {
  eyebrow: 'Perguntas frequentes',
  title: 'Tudo o que precisa de saber',
  description: 'Se ficar alguma dúvida, falamos por telefone ou à chegada. Sem pressa.',
  items: [
    {
      q: 'Preciso de marcar horário?',
      a: 'Recomendamos sempre. Assim garantimos o tempo necessário para o seu serviço e evitamos esperas. A marcação online demora menos de um minuto.',
    },
    {
      q: 'Como funciona a marcação online?',
      a: 'Crie conta, escolha o serviço, o dia e a hora. A marcação fica pendente até a Gabi a confirmar no painel — recebe a confirmação na sua conta.',
    },
    {
      q: 'Posso cancelar ou alterar?',
      a: 'Sim. Pode cancelar diretamente na sua conta. Para alterar, cancele e marque um novo horário; se faltarem menos de 24 horas, ligue-nos.',
    },
    {
      q: 'Que formas de pagamento aceitam?',
      a: 'Dinheiro, Multibanco e MB WAY. O pagamento é feito na barbearia, no final do serviço.',
    },
    {
      q: 'Fazem cortes para crianças?',
      a: 'Sim, a partir dos 6 anos, com tempo reservado e paciência extra. Mencione nas notas da marcação para prepararmos a visita.',
    },
    {
      q: 'Onde fica a barbearia?',
      a: 'Na Rua do Almada, 128, no centro do Porto. Há estacionamento pago a poucos metros e transportes públicos por perto.',
    },
  ],
}

export const cta = {
  eyebrow: 'A sua próxima visita',
  title: 'Reserve o seu momento.',
  description:
    'Escolha o ritual, o dia e a hora. O resto fica por nossa conta — com o cuidado de sempre.',
  primary: { label: 'Marcar horário', href: '/marcar' },
  note: 'Terça a sábado · 09:00 — 19:30',
}

export const loginQuote = {
  quote: 'Não é só um corte. É a sua assinatura.',
  caption: 'Barbearia da Gabi · Porto',
}

export const footer = {
  blurb:
    'Cortes, barbas e cuidado com detalhe, no coração do Porto. Um espaço para abrandar e sair a sentir-se bem.',
  legal: `© ${new Date().getFullYear()} Barbearia da Gabi. Todos os direitos reservados.`,
}
