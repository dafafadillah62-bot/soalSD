import { Question, Subject } from './types';

export const SUBJECTS: Subject[] = ['Matematika', 'IPA', 'Bahasa Indonesia', 'IPS'];

export const QUESTIONS: Record<Subject, Question[]> = {
  'Matematika': [
    {
      id: 'm1',
      text: 'Berapakah hasil dari 15 + 27?',
      options: ['32', '42', '52', '45'],
      correctAnswer: 1,
      explanation: '15 + 27 = 42'
    },
    {
      id: 'm2',
      text: 'Jika sebuah apel harganya Rp 2.000, berapa harga 5 apel?',
      options: ['Rp 8.000', 'Rp 10.000', 'Rp 12.000', 'Rp 15.000'],
      correctAnswer: 1,
      explanation: '5 x 2.000 = 10.000'
    },
    {
      id: 'm3',
      text: 'Bangun datar yang memiliki 3 sisi disebut...',
      options: ['Persegi', 'Lingkaran', 'Segitiga', 'Trapesium'],
      correctAnswer: 2,
      explanation: 'Segitiga memiliki 3 sisi.'
    }
  ],
  'IPA': [
    {
      id: 'i1',
      text: 'Planet yang dikenal sebagai Planet Merah adalah...',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturnus'],
      correctAnswer: 1,
      explanation: 'Mars disebut planet merah karena permukaannya mengandung oksida besi.'
    },
    {
      id: 'i2',
      text: 'Hewan yang memakan tumbuhan disebut...',
      options: ['Karnivora', 'Omnivora', 'Herbivora', 'Insektivora'],
      correctAnswer: 2,
      explanation: 'Herbivora adalah pemakan tumbuhan.'
    },
    {
      id: 'i3',
      text: 'Benda yang dapat menarik benda logam disebut...',
      options: ['Batu', 'Kayu', 'Magnet', 'Plastik'],
      correctAnswer: 2,
      explanation: 'Magnet memiliki gaya tarik terhadap benda logam tertentu.'
    }
  ],
  'Bahasa Indonesia': [
    {
      id: 'b1',
      text: 'Lawan kata dari "Besar" adalah...',
      options: ['Luas', 'Kecil', 'Tinggi', 'Lebar'],
      correctAnswer: 1,
      explanation: 'Antonim atau lawan kata besar adalah kecil.'
    },
    {
      id: 'b2',
      text: 'Ibu sedang ... nasi di dapur.',
      options: ['Makan', 'Mencuci', 'Memasak', 'Membeli'],
      correctAnswer: 2,
      explanation: 'Kata yang tepat untuk kegiatan di dapur adalah memasak.'
    }
  ],
  'IPS': [
    {
      id: 's1',
      text: 'Ibu kota negara Indonesia adalah...',
      options: ['Surabaya', 'Bandung', 'Jakarta', 'Medan'],
      correctAnswer: 2,
      explanation: 'Jakarta adalah ibu kota negara Indonesia saat ini.'
    },
    {
      id: 's2',
      text: 'Pahlawan yang dijuluki Bapak Pendidikan Nasional adalah...',
      options: ['Ir. Soekarno', 'Ki Hajar Dewantara', 'Moh. Hatta', 'Jenderal Sudirman'],
      correctAnswer: 1,
      explanation: 'Ki Hajar Dewantara adalah tokoh pendidikan Indonesia.'
    }
  ]
};
