export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_oq4bk1e',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_d58ad5d',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'jFrRS_CiaciugTvMz',
  },
};

export default config;
