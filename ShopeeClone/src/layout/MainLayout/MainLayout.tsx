import React from 'react';
import Footer from 'src/components/Footer';
import Header from 'src/components/Header';

interface Props {
    children: React.ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default MainLayout;
