import { Heart, School, Users, Sparkles, Smile, Briefcase, Utensils, Music, Brain, Gamepad2 } from 'lucide-react';

export const CATEGORIES = [
	{ id: 'love', name: '연애', icon: Heart, href: '/category/love' },
	{ id: 'school', name: '학교', icon: School, href: '/category/school' },
	{ id: 'friends', name: '친구', icon: Users, href: '/category/friends' },
	{ id: 'self', name: '자기개발', icon: Sparkles, href: '/category/self' },
	{ id: 'meme', name: '밈', icon: Smile, href: '/category/meme' },
	{ id: 'job', name: '직업', icon: Briefcase, href: '/category/job' },
	{ id: 'food', name: '음식', icon: Utensils, href: '/category/food' },
	{ id: 'music', name: '음악', icon: Music, href: '/category/music' },
	{ id: 'personality', name: '성격', icon: Brain, href: '/category/personality' },
	{ id: 'fun', name: '재미', icon: Gamepad2, href: '/category/fun' },
];
