import React, { useRef, useState } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (value: string) => void;
  onChange?: (value: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const otpValue = newOtp.join('');
    onChange?.(otpValue);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    if (isNaN(Number(pastedData))) return;

    const otpArray = pastedData
      .slice(0, length)
      .split('')
      .map((char) => (isNaN(Number(char)) ? '' : char));

    const newOtp = otpArray.concat(new Array(length - otpArray.length).fill(''));
    setOtp(newOtp);

    const otpValue = newOtp.join('');
    onChange?.(otpValue);

    if (otpArray.length === length && onComplete) {
      onComplete(otpValue);
    }

    const nextEmptyIndex = otpArray.findIndex((value) => !value);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 md:gap-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            // ref={(ref) => (inputRefs.current[index] = ref)}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`
              w-[40px] h-[40px]
              sm:w-[50px] sm:h-[50px]
              md:w-[60px] md:h-[55px]
              text-center text-lg font-semibold
              border-[3px] rounded-lg
              focus:outline-none focus:border-[#CD1B78]
              transition-all duration-200
              ${digit ? 'border-[#CD1B78]' : 'border-[#9ea3ae]'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default OTPInput;
