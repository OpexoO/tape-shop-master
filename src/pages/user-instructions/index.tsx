import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/UserInstructions').then((mod) => mod.default));
export default Page;
