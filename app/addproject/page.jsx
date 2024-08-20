'use client'
import { useState } from 'react';

const Page = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, message } = formData;

        // Basic validation
        if (!name || !email || !message) {
            setError('All fields are required');
            return;
        }

        setError(null); // Clear error

        // Email sending logic (example using EmailJS or other email API)
        try {
            const emailData = {
                to: process.env.NEXT_PUBLIC_RECEIVER_EMAIL,
                subject: 'Nouveau message du formulaire',
                body: `
                    Nom: ${name}
                    Email: ${email}
                    Message: ${message}
                `
            };

            // Replace the following with your actual email sending logic
            // await sendEmail(emailData); 

            // Reset form on success
            setFormData({
                name: '',
                email: '',
                message: ''
            });
        } catch (error) {
            console.error('Error sending email:', error);
            setError('Failed to send email. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>
                Nom:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </label>
            <br />
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <br />
            <label>
                Message:
                <textarea name="message" value={formData.message} onChange={handleChange} />
            </label>
            <br />
            <button type="submit">Envoyer</button>
        </form>
    );
};

export default Page;
