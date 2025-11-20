import Image from 'next/image';

export const Logo = () => {
    return (
        <div className="w-full flex justify-center mt-[44px]">
            <Image
                src="/images/logo/blott.png"
                alt="Blott Logo"
                width={200}
                height={50}
                priority
                className="w-full max-w-[200px] h-auto"
            />
        </div>
    );
};
