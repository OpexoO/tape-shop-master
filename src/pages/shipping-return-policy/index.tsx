import dynamic from 'next/dynamic';

const Page = dynamic(() => import('@/components/ShippingReturnPolicy').then((mod) => mod.default));
export default Page;
