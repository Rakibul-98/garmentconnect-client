/* eslint-disable react/prop-types */
import { useForm } from 'react-hook-form';
import mCard from '../../assets/mastercard.svg';
import vCard from '../../assets/visa.svg';
import card from '../../assets/payment_card.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router';


export default function Payment({setPaymentStatus}) {
    const { register, reset, handleSubmit, formState: { errors }, setError } = useForm();
    const [missingField, setMissingField] = useState({
        card_holder_name: false,
        card_number: false,
        expiry_date: false,
        cvc: false,
    })
    const navigate = useNavigate();

    const validateCardNumber = (number) => {
        const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
        const mastercardRegex = /^5[1-5][0-9]{14}$|^2[2-7][0-9]{14}$/;

        if (visaRegex.test(number)) {
            return 'Visa';
        } else if (mastercardRegex.test(number)) {
            return 'MasterCard';
        } else {
            return 'Invalid';
        }
    };

    const luhnAlgorithm = (number) => {
        let sum = 0;
        let shouldDouble = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return (sum % 10 === 0);
    };

    const isCardNumberValid = (number) => {
        const cardType = validateCardNumber(number);
        return cardType !== 'Invalid' && luhnAlgorithm(number);
    };

    const handleChange = (field) => {
        setMissingField(prev => ({ ...prev, [field]: false }));
    };

    const onSubmit = (data) => {
        if (!data.card_holder_name) {
            setMissingField({ ...missingField, card_holder_name: true });
            return
        }
        if (!data.card_number) {
            setMissingField({ ...missingField, card_number: true });
            return
        }else if (!isCardNumberValid(data['card_number'])) {
            setError('card_number', { type: 'manual', message: 'Invalid card number' });
            return
        }

        if (!data.expiry_date) {
            setMissingField({ ...missingField, expiry_date: true });
            return
        }
        if (!data.cvc) {
            setMissingField({ ...missingField, cvc: true });
            return
        }
        alert("Congratulation!! Payment successful.");
        navigate('/compose');
        setPaymentStatus(true);
        reset();
    };

    const inputClass = `mt-1 p-[6px] w-full bg-transparent border focus:outline-none focus:border-black rounded-sm`

    return (
        <div className='flex items-center justify-center mt-7 mb-10 lg:mb-0'>
            <div className='sm:w-[381px] text-[12px] border shadow-md rounded-sm py-7 px-4 sm:px-6'>
                <div className='flex justify-end gap-[18px] items-center mb-6'>
                    <img className="h-[35px] w-[48px]" src={vCard} alt="Visa" />
                    <img className="h-[35px] w-[44px]" src={mCard} alt="MasterCard" />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-[12px]">
                        <label className={`${missingField.card_holder_name && 'text-red-500'}`} htmlFor="">Card Holder Name</label>
                        <input
                            className={`${inputClass} ${missingField.card_holder_name && 'border-red-500'}`}
                            placeholder=' *Exact name on your card'
                            type='text'
                            {...register("card_holder_name", { onChange: () => handleChange('card_holder_name') })}
                        />
                    </div>
                    <div className="relative mb-[12px]">
                        <div className=' flex justify-between items-center'>
                            <label className={`${missingField.card_number && 'text-red-500'}`} htmlFor="">Card Number</label>
                            {errors['card_number'] &&
                                <p className="text-[#FB293E]">{errors['card_number'].message}</p>
                            }
                        </div>
                        <input
                            className={`${inputClass} ${missingField.card_number && 'border-red-500'}`}
                            type='number'
                            {...register("card_number", { onChange: () => handleChange('card_number') })}
                        />
                        <div className="absolute inset-y-0 right-[6px] pt-6 flex items-center pointer-events-none">
                            <img className='h-[28px] w-[26px] opacity-50' src={card} alt="Card" />
                        </div>
                    </div>
                    <div className="w-full flex gap-5">
                        <div className='w-1/2'>
                            <label className={`${missingField.expiry_date && 'text-red-500'}`} htmlFor="">Expiration Date</label> <br />
                            <input
                                className={`${inputClass} ${missingField.expiry_date && 'border-red-500'}`}
                                placeholder='01 / 2024'
                                {...register("expiry_date", { onChange: () => handleChange('expiry_date') })}
                            />
                        </div>
                        <div className='w-1/2'>
                            <label className={`${missingField.cvc && 'text-red-500'}`} htmlFor="">CVC / CVV</label> <br />
                            <input
                                className={`${inputClass} ${missingField.cvc && 'border-red-500'}`}
                                placeholder='123'
                                type='number'
                                {...register("cvc", { onChange: () => handleChange('cvc') })}
                            />
                        </div>
                    </div>
                    <input
                        className='mt-5 w-full bg-[#199980] hover:bg-[#288f7e] rounded-[4px] px-4 py-[15px] text-white text-[15px] cursor-pointer'
                        type="submit"
                        value="Annual Recharge $25"
                    />
                </form>
            </div>
        </div>
    );
}
