import { Spartan } from '@/types';

const names = [
  'Priya Rai',
  'Divya Saxena',
  'Sanjay Thakur',
  'Meera Chopra',
  'Nikhil Das',
  'Riya Malhotra',
  'Varun Kapoor',
  'Aarav Mishra',
  'Kavya Iyer',
  'Aditya Sharma',
  'Sneha Reddy',
  'Rohan Bhat',
  'Ishita Mehta',
  'Arjun Pillai',
  'Karthik Rao',
];

const designations = ['Admin', 'City Lead', 'Campus Admin', 'Media Coordinator'];

const colleges = [
  "St. Xavier's, Mumbai",
  'Christ, Bangalore',
  'NMIMS, Mumbai',
  'VIT, Chennai',
  'IIT Delhi',
  'SRCC, Delhi University',
];

const dates = ['23/1/23', '14/2/23', '05/3/23', '18/4/23', '09/5/23', '21/6/23'];

const avatarColors = [
  'E8D5B7',
  'B7D5E8',
  'D5E8B7',
  'E8B7D5',
  'B7E8D5',
  'D5B7E8',
  'E8E8B7',
  'B7B7E8',
];

// helper: pick random item from array
const randomOf = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// helper: random boolean (bias 70% available)
const randomStatus = () => (Math.random() < 0.7 ? 'available' : 'unavailable');

export const spartansData: Spartan[] = Array.from({ length: 30 }, (_, idx) => {
  const name = randomOf(names);
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('');

  return {
    id: String(idx + 1),
    name,
    avatarUrl: `https://ui-avatars.com/api/?name=${initials}&background=${randomOf(
      avatarColors
    )}&color=3C3D3E&size=32`,
    designation: randomOf(designations),
    college: randomOf(colleges),
    dateJoined: randomOf(dates),
    approvedBy: 'Sahil Mehra - Central Admin',
    status: randomStatus(),
  };
});
