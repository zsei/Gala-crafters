import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_zco3yd3'; 
const EMAILJS_TEMPLATE_ID = 'template_ksfvw1c';
const EMAILJS_PUBLIC_KEY = 'YzeVxKB6QuRVolwkx';

export const sendVerificationEmail = async (userEmail: string, userName: string, code: string) => {
  try {
    const templateParams = {
      email: userEmail,
      to_name: userName,
      passcode: code,
      time: '15 minutes',
      company_name: 'Gala Crafters',
      app_name: 'Gala Crafters',
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    return response;
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};
