import CustomButton from '../atoms/CustomButton';

function Enterprise() {
  return (
    <div className="mx-4">
      <div
        className="max-w-[1200px] mx-auto md:py-[46px] py-[36px] px-[32px] md:mt-[72px] mt-[56px] md:mb-[40px] mb-[120px]"
        style={{
          border: '1px solid #CD1B78',
          borderRadius: '16px',
        }}
      >
        <h2 className="text-[20px] text-center md:text-[40px] text-[#CD1B78] font-bold font-urbanist">Enterprise </h2>
        <p className="max-w-[929px] mx-auto leading-[48px] text-center mt-[14px] text-[20px] md:text-[30px] font-medium text-[#212529CC] font-urbanist">
          Designed for greater flexibility, this plan offers advanced tools for custom tailoring to your needs.
        </p>
        <CustomButton
          mode="primary"
          textColor="#fff"
          className="mt-[32px] max-w-[244px] mx-auto md:mt-[52px]"
          onClick={() => window.open('https://calendly.com/precious-zino-uricreative/let-s-talk-about-uri', '_blank')}
        >
          Book a Demo
        </CustomButton>
      </div>
    </div>
  );
}

export default Enterprise;
