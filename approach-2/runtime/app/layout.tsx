import type {Metadata} from 'next';
export const metadata:Metadata={title:'Fieldguide — Approach 2',description:'College pathway exploration and choice statistics.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
