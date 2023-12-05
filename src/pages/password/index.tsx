import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/PasswordCreate').then((mod) => mod.default));
export default Page;
