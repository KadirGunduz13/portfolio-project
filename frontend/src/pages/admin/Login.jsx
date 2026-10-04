import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (data) => {
        try {
            setErrorMsg('');
            const response = await axiosClient.post('/auth/login', data);
            localStorage.setItem('token', response.data.token);
            navigate('/admin/about'); // Başarılı girişte doğrudan AboutManager'a yönlendirir
        } catch (error) {
            setErrorMsg('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
        }
    };

    return (
        <div className="pt-32 min-h-screen flex flex-col items-center px-4 bg-background">
            <div className="bg-surface-container-low/90 backdrop-blur-xl p-8 rounded-xl border border-outline-variant/30 w-full max-w-md shadow-2xl">
                <h1 className="text-3xl font-headline-lg text-on-surface mb-6 text-center">Admin Giriş</h1>

                {errorMsg && (
                    <div className="bg-error-container/20 border border-error text-error p-3 rounded-lg mb-6 text-sm text-center font-label-md">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
                            <span>Kullanıcı Adı</span>
                        </label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">person</span>
                            <input
                                type="text"
                                {...register('username', { required: 'Kullanıcı adı zorunludur' })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant"
                                placeholder="admin"
                            />
                        </div>
                        {errors.username && <span className="text-error text-xs mt-1 font-label-sm">{errors.username.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
                            <span>Şifre</span>
                        </label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-outline text-lg pointer-events-none">lock</span>
                            <input
                                type="password"
                                {...register('password', { required: 'Şifre zorunludur' })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline-variant"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <span className="text-error text-xs mt-1 font-label-sm">{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-label-md text-label-md shadow-lg shadow-primary-container/30 py-3 rounded-lg transition-all mt-2 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">login</span>
                        <span>Giriş Yap</span>
                    </button>
                </form>
            </div>
        </div>
    );
}