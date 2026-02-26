import { WhiteLabelConfig, User, Course, ContentItem, Module } from './types';

export const INITIAL_WHITE_LABEL: WhiteLabelConfig = {
  institutionName: 'Instituto de Tecnologia Avançada',
  logoUrl: 'https://picsum.photos/seed/logo/200/200',
  primaryColor: '#0f172a', // Slate 900
  secondaryColor: '#334155', // Slate 700
  faviconUrl: 'https://picsum.photos/seed/favicon/32/32',
};

export const MOCK_USER_DIRECTOR: User = {
  id: 'u1',
  name: 'Dr. Ricardo Silva',
  email: 'diretoria@ita.edu.br',
  role: 'DIRECTOR',
  avatar: 'https://i.pravatar.cc/150?u=u1',
};

export const MOCK_USER_PROFESSOR: User = {
  id: 'u2',
  name: 'Profa. Helena Costa',
  email: 'helena.costa@ita.edu.br',
  role: 'PROFESSOR',
  avatar: 'https://i.pravatar.cc/150?u=u2',
  hasFacialTemplate: false,
};

export const MOCK_USER_STUDENT: User = {
  id: 'u3',
  name: 'Carlos Eduardo',
  email: 'carlos.edu@gmail.com',
  role: 'STUDENT',
  avatar: 'https://i.pravatar.cc/150?u=u3',
  hasFacialTemplate: false,
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Compliance e Ética Corporativa',
    description: 'Treinamento obrigatório sobre normas regulatórias e conduta ética no ambiente de trabalho.',
    thumbnail: 'https://picsum.photos/seed/compliance/800/400',
    progress: 65,
    modules: [
      {
        id: 'm1',
        title: 'Introdução ao Compliance',
        completed: true,
        content: [
          { id: 'ct1', type: 'video', title: 'Aula 1: Fundamentos', youtubeId: 'dQw4w9WgXcQ', materialUrl: 'https://example.com/material1.pdf' },
          { id: 'ct1b', type: 'html', title: 'O que é Compliance?', body: '<h1>Introdução</h1><p>Compliance é o conjunto de disciplinas para fazer cumprir as normas legais e regulamentares...</p>', materialUrl: 'https://example.com/material2.pdf' }
        ]
      },
      {
        id: 'm2',
        title: 'Código de Conduta',
        completed: true,
        content: [
          { id: 'ct2', type: 'pdf', title: 'PDF do Código de Conduta 2024', url: '#', materialUrl: 'https://example.com/material3.pdf' }
        ]
      },
      {
        id: 'm3',
        title: 'Prevenção à Lavagem de Dinheiro',
        completed: false,
        content: [
          { id: 'ct3', type: 'live', title: 'Transmissão: Mecanismos de Prevenção', youtubeId: '5qap5aO4i9A', materialUrl: 'https://example.com/material4.pdf' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Segurança da Informação ISO 27001',
    description: 'Certificação técnica para implementação de sistemas de gestão de segurança da informação.',
    thumbnail: 'https://picsum.photos/seed/security/800/400',
    progress: 0,
    modules: []
  }
];

export const MOCK_EXAM = {
  id: 'e1',
  courseId: 'c1',
  title: 'Avaliação Final - Compliance 2024',
  durationMinutes: 45,
  questions: [
    {
      id: 'q1',
      text: 'Qual é o principal objetivo de um programa de Compliance em uma instituição financeira?',
      options: [
        'Aumentar o lucro líquido trimestral',
        'Garantir a conformidade com leis e regulamentos',
        'Reduzir o número de funcionários',
        'Eliminar a necessidade de auditoria externa'
      ],
      correctAnswer: 1
    },
    {
      id: 'q2',
      text: 'O que caracteriza o conflito de interesses no ambiente corporativo?',
      options: [
        'Trabalhar em mais de um projeto ao mesmo tempo',
        'Discordar da opinião de um colega em uma reunião',
        'Quando interesses pessoais interferem na tomada de decisão profissional',
        'Pedir demissão para trabalhar em um concorrente'
      ],
      correctAnswer: 2
    },
    {
      id: 'q3',
      text: 'Sobre a Lei Geral de Proteção de Dados (LGPD), qual afirmação é correta?',
      options: [
        'Aplica-se apenas a empresas de tecnologia',
        'Dados pessoais podem ser coletados sem qualquer finalidade',
        'O titular dos dados tem direito de acesso e correção',
        'Não há penalidades para o descumprimento da lei'
      ],
      correctAnswer: 2
    }
  ]
};
